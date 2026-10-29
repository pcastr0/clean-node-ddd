# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                  # Dev server (tsx watch, port 3000)
npm run build                # Compile TypeScript to dist/
npm run typecheck            # Type-check src, config and test (no emit)
npm start                    # Production via PM2 cluster (dist/cluster.js)
npm run start:single         # Production, single process (dist/index.js)

npm test                     # Unit + integration
npm run test:unit            # Unit tests only (no database needed)
npm run test:integration     # Integration tests only (truncates the test DB!)
npm run test:unit -- test/unit/app/user/GetUser.spec.ts   # Single test file
npm run coverage             # c8 + mocha (unit tests)
npm run lint                 # eslint (flat config + typescript-eslint)

npm run sequelize db:migrate        # Run migrations (sequelize-cli)
npm run sequelize migration:generate -- --name create-foo

npm run console              # REPL with the DI container exposed as `container`
```

**Unit tests need no database.** Integration tests (`test/setup.integration.ts`) truncate the database via `beforeEach(cleanDatabase)` and need a reachable MySQL instance matching the `test` entry in `config/database.js` — a dedicated `clean_node_ddd_test` database (migrate it first: `NODE_ENV=test npm run sequelize db:migrate`). **Caution**: truncation is destructive.

## Module resolution

Imports are relative (`../../domain/user/User`) everywhere. The old `NODE_PATH=.` convention is gone; there are no path aliases. `npm run build` emits a `dist/` tree that mirrors the repo, so `node dist/index.js` just works — `npm start` runs the compiled output, not the TS sources.

## TypeScript conventions

- `strict: true`, CommonJS modules, target ES2022 (see `tsconfig.json`).
- **Two deliberate JS exceptions**: `config/database.js` (sequelize-cli `require()`s it — it can't be TypeScript) and `src/infra/database/migrations/` (sequelize-cli-authored artifacts). `.sequelizerc` points sequelize-cli at both.
- `tsconfig.test.json` additionally type-checks `test/` — run `npm run typecheck` after touching specs.

## Architecture

DDD + Clean Architecture with four layers under `src/`, all wired together by an Awilix DI container. The flow of one request:

```
HTTP request → interfaces/http (router → controller) → app/ use case → infra/ repository → domain/ entity
```

### src/container.ts — the composition root

Awilix registers everything behind a `Cradle` interface (`AwilixContainer<Cradle>`): app/server singletons, config, middleware, Sequelize models/database, repositories, use cases, serializers. Because the cradle is typed, `container.resolve('usersRepository')` and `inject(({ createUser }) => ...)` both type-check. Two things live here that are easy to miss:

- `containerMiddleware` is `scopePerRequest(container)` — each HTTP request gets a scoped container (this is what `awilix-express`'s `inject()` reads from).
- The error handler is chosen by env: `config.isProduction ? errorHandler : devErrorHandler`.

To add a feature, register it here — nothing else discovers modules automatically except the model convention loader below.

### src/domain — entities, errors, and the repository port

- Entities are plain TypeScript classes (`User`) with a hand-rolled `validate()` → `{ valid, errors }`. Validation messages are an API contract (asserted by integration tests): `'"firstName" is required'`, `'"firstName" is not allowed to be empty'`, `'"email" must be a valid email'`. Change them only with the API consumers in mind.
- `src/domain/errors/` holds the typed error classes — `ValidationError` (`.details` is an array) and `NotFoundError` (`.details` is a string). These are the error vocabulary of the whole app; nothing matches on error message strings anymore.
- `src/domain/user/UsersRepository.ts` is the port the use cases depend on. No persistence knowledge here.

### src/app — use cases

Each use case is a small async class whose `execute()` **returns a result or throws** — there is no EventEmitter/outputs machinery anymore. `CreateUser.execute(userData)` builds the entity and delegates to `this.usersRepository.add(user)`; the repository throws typed errors, which propagate to the controller. New use cases go in the per-feature folder, get re-exported from its `index.ts`, and are registered in the container.

### src/infra — persistence

- `database/models/` — Sequelize models, **auto-loaded by filename** via `ModelsLoader` (any `.ts`/`.js` except `index`; `loaded.database` is the Sequelize instance, `associate(models)` hooks are called). Adding a model file is enough — no manual registration.
- `user/SequelizeUsersRepository.ts` — implements the `UsersRepository` port. Owns all Sequelize knowledge (projection, query options) and throws `ValidationError` / `NotFoundError` instead of Sequelize errors. `update()` validates before persisting.
- `user/SequelizeUserMapper.ts` — converts between Sequelize rows and domain entities (`toEntity` / `toDatabase`). Keep field lists in sync with the entity and serializer.
- Migrations live in `src/infra/database/migrations`; `.sequelizerc` also points `seeders-path` at `src/infra/database/seeds`, but that folder doesn't exist yet — create it before running seed commands.

### src/interfaces — delivery

- `http/router.ts` mounts everything under `/api` (Swagger UI at `/api/docs`); it imports controller routers **directly** (`import { usersRouter } from './user/UsersController'`) — the old string-path controller resolver is gone.
- Controllers are modules exporting a ready `Router()`, not classes. Route handlers use `inject(({ createUser, ... }) => ...)` to pull request-scoped dependencies, `await` the use case, and map errors through the single `handleDomainError` in `errors/domainErrorResponder.ts` (`ValidationError` → 400, `NotFoundError` → 404, anything else → `next(err)`).
- `http/user/UserSerializer.ts` — whitelists entity fields for JSON responses.
- `console/` — REPL interface (promise-aware eval) exposing the container.

### Config

`config/index.ts` merges `config/environments/{NODE_ENV}.ts` (web port, log4js config) with the `db` config from `config/database.js` (or `CLEARDB_DATABASE_URL` / `DATABASE_URL` for Heroku). Env checks go through the explicit flags — `config.isDevelopment`, `config.isTest`, `config.isProduction` — never `config.env === '...'`. Registered in the container as `config`. An unknown `NODE_ENV` fails loudly at startup.

## Testing conventions

- Unit tests (`test/unit/`) mirror the `src/` tree, mock the repository with plain object literals (the narrowed `Pick<UsersRepository, ...>` constructor types make this compile without casts), and assert on returned values / thrown typed errors. **No database, no setup file.**
- Integration tests (`test/integration/`) hit the real Express app via `test/utils/request` (supertest against the container-resolved server). `test/integration/infra/` holds DB-backed specs (the Sequelize repository adapter). Only the integration mocharc loads `test/setup.integration.ts` (`beforeEach(cleanDatabase)`).
- Test files must be named `*.spec.ts` — the mocharc spec globs are `test/unit/**/*.spec.ts` and `test/integration/**/*.spec.ts`, so any other extension is silently skipped.
- Test data comes from the typed factory in `test/utils/factory.ts` (`factory.create(overrides)` / `factory.createMany(n, [overrides])`) over the Sequelize models, with chance-based defaults from `test/utils/dataFaker.ts`.
- Mocha configs: `test/.mocharc.unit.js` and `test/.mocharc.integration.js` (both use the `tsx/cjs` require hook to run TS specs).
- Coverage runs through c8, excluding `container.ts`, `app/Application.ts`, and `interfaces/http` (see the `coverage` script).

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (pcastr0/clean-node-ddd) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles use their default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` at the repo root and ADRs in `docs/adr/`, both created lazily by `/domain-modeling`. See `docs/agents/domain.md`.