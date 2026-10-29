# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                  # Dev server (nodemon, port 3000)
npm start                    # Production via PM2 cluster (cluster.js)

npm test                     # Unit + integration
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests only
npm run test:unit -- test/unit/app/user/GetUser.spec.js   # Single test file
npm run coverage             # nyc + mocha (unit tests)
npm run lint                 # eslint on src, test, config

npm run sequelize db:migrate        # Run migrations (sequelize-cli)
npm run sequelize migration:generate -- --name create-foo

npm run console              # REPL with the DI container exposed as `container`
```

**Database required for tests**: both test suites load `test/setup.js`, which truncates the database via `beforeEach(cleanDatabase)` — even unit tests need a reachable MySQL instance matching the `test` entry in `config/database.js`. **Caution**: tests truncate the configured database; the `test` env in the tracked `config/database.js` points at the same database as `development`.

## Module resolution

`NODE_PATH=.` is set in all npm scripts, so requires are root-relative and resolve without paths: `require('src/container')`, `require('config')`, `require('test/utils/request')`. Always use this style — files never use relative `../../..` paths.

## Architecture

DDD + Clean Architecture with four layers under `src/`, all wired together by an Awilix DI container. The flow of one request:

```
HTTP request → interfaces/http (router → controller) → app/ Operation → infra/ repository → domain/ entity
```

### src/container.js — the composition root

Awilix registers everything: app/server singletons, config, middleware, Sequelize models/database, repositories, use-case operations, serializers. Two things live here that are easy to miss:

- `containerMiddleware` is `scopePerRequest(container)` — each HTTP request gets a scoped container (this is what `awilix-express`'s `inject()` reads from).
- The error handler is chosen by env: `config.production ? errorHandler : devErrorHandler`.

To add a feature, register it here — nothing else discovers modules automatically except the convention loaders below.

### src/domain — entities

Plain classes validated by the `structure` library (`attributes({...})(class ...)`). Entities carry business rules (e.g. `User.isLegal()`) and expose `validate()` → `{ valid, errors }`. No persistence knowledge here.

### src/app — use cases as Operations

Each use case extends `src/app/Operation.js` (an EventEmitter) and declares its outputs up front:

```js
class CreateUser extends Operation { ... }
CreateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
```

Operations don't return or throw to callers — they `emit(output, payload)` after `execute()`. Controllers subscribe to each output. This emit-based contract is the pattern every layer follows; add new use cases to the per-feature `index.js` and register them in the container.

### src/infra — persistence

- `database/models/` — Sequelize models, **auto-loaded by filename** via `ModelsLoader` (any `.js` except `index.js` in the folder; `loaded.database` is the Sequelize instance, `associate(models)` hooks are called). Adding a model file is enough — no manual registration.
- `user/SequelizeUsersRepository.js` — implements the port the operations depend on (`usersRepository`). Translates Sequelize errors into domain errors by message convention: throws `Error('ValidationError')` / `Error('NotFoundError')` with `.details` attached.
- `user/SequelizeUserMapper.js` — converts between Sequelize rows and domain entities (`toEntity` / `toDatabase`). Keep field lists in sync with the entity and serializer.
- Migrations live in `src/infra/database/migrations`; `.sequelizerc` also points `seeders-path` at `src/infra/database/seeds`, but that folder doesn't exist yet — create it before running seed commands.

### src/interfaces — delivery

- `http/router.js` mounts everything under `/api` (Swagger UI at `/api/docs`); controllers are referenced by string path (`controller('user/UsersController')` resolved by `createControllerRoutes`).
- Controllers are plain objects with a `router` getter, not classes. Route handlers use `inject(({ createUser, ... }) => ...)` to pull request-scoped dependencies, subscribe to the operation's outputs, and map them to HTTP statuses (`SUCCESS` → 200/201, `VALIDATION_ERROR` → 400, `NOT_FOUND` → 404, `ERROR` → `next(err)`).
- `http/user/UserSerializer.js` — whitelists entity fields for JSON responses.
- `console/` — REPL interface (promise-aware eval) exposing the container.

### Config

`config/index.js` merges `config/environments/{NODE_ENV}.js` (web port, log4js config) with the `db` config from `config/database.js` (or `CLEARDB_DATABASE_URL` / `DATABASE_URL` for Heroku). Each env object gets a truthy flag, e.g. `config.production`. Registered in the container as `config`.

## Testing conventions

- Unit tests (`test/unit/`) mirror the `src/` tree and mock the repository with plain objects (`{ add: () => Promise.resolve(user) }`), asserting on emitted outputs.
- Integration tests (`test/integration/`) hit the real Express app via `test/utils/request` (supertest against the container-resolved server).
- Test files must be named `*.spec.js` — the mocharc spec globs are `test/unit/**/*.spec.js` and `test/integration/**/*.spec.js`, so any other extension is silently skipped.
- Test data comes from factory-girl: `test/utils/factory.js` auto-loads every file in `test/utils/factories/` (convention: file exports `(factory, models) => factory.define('user', models.user, {...})`), using `src/infra/utils/dataFaker` for random values.
- Mocha configs: `test/.mocharc.unit.js` and `test/.mocharc.integration.js` (both load `test/setup.js`).
- nyc coverage excludes `container.js`, `app/Application.js`, and `interfaces/http` (see `.nycrc`).