# Clean Node DDD

A Node.js + **TypeScript** REST API boilerplate implementing **Domain-Driven Design (DDD) + Clean Architecture**, built with Express and Sequelize and wired together with an Awilix dependency-injection container.

## Features

- Clean Architecture layering — domain logic isolated from frameworks and persistence
- TypeScript in `strict` mode across `src`, `config` and `test` (sequelize-cli's config and migrations stay JavaScript)
- Awilix DI container with request-scoped resolution (`scopePerRequest`) and a fully typed cradle
- Use cases as plain async classes that return or throw — no EventEmitter plumbing
- Typed domain errors (`ValidationError` / `NotFoundError`) crossing the repository seam, mapped to HTTP statuses in one place
- Sequelize + MySQL persistence behind repository ports, with mappers to domain entities
- Swagger UI served from the app itself
- Promise-aware REPL console exposing the DI container
- Unit + integration test suites (Mocha/Chai) — unit tests run with no database at all
- PM2 cluster mode for production, Heroku deployment support

## Architecture

Four layers under `src/`, all wired together in `src/container.ts` (the composition root). Dependencies only point inward:

```
HTTP request
   │
   ▼
src/interfaces/http          delivery: router → controllers
   │
   ▼
src/app/                     use cases: plain async classes
   │
   ▼
src/infra/                   persistence: repositories, Sequelize models, mappers
   │
   ▼
src/domain/                  entities: pure business rules + typed errors
```

Key ideas:

- **Use cases** — every use case is a small async class whose `execute()` returns a result or throws (`CreateUser.execute(userData)` → `Promise<User>`). Controllers `await` the use case and map caught errors to HTTP statuses via a single module (`src/interfaces/http/errors/domainErrorResponder.ts`).
- **Composition root** — everything is registered manually in `src/container.ts` behind a `Cradle` interface, so `container.resolve(...)` and `inject(...)` are fully typed. The only convention loader is Sequelize models (`src/infra/database/models/`, any `.ts`/`.js` except `index` is auto-loaded).
- **Request scope** — `scopePerRequest(container)` gives each HTTP request a scoped container; controllers pull dependencies with `inject(({ createUser, ... }) => ...)` from `awilix-express`.
- **Repository ports** — use cases depend on the `UsersRepository` interface, implemented by `SequelizeUsersRepository`, which owns all Sequelize knowledge (projection, query options) and throws the domain error classes (`ValidationError` / `NotFoundError`) instead of string-convention errors.
- **Serializers** — `UserSerializer` whitelists entity fields for JSON responses.

Imports are relative (`require('../../domain/user/User')` style) — there is no `NODE_PATH` trickery; the compiled output in `dist/` mirrors the repo layout exactly.

## Project structure

```
├── config/                  env-based config (port, logging) + database config
├── src/
│   ├── container.ts         Awilix composition root + Cradle interface
│   ├── domain/              entities (User), typed errors, repository port
│   ├── app/                 use cases (plain async classes)
│   ├── infra/               repositories, Sequelize models, migrations, logging
│   └── interfaces/          HTTP (controllers, serializers, swagger) + REPL console
├── test/
│   ├── unit/                mirrors src/, mocks the repository — no DB needed
│   └── integration/         hits the real Express app (and MySQL) via supertest
├── index.ts                 single-process entry point
└── cluster.ts               PM2 cluster entry point for production
```

## Getting started

### Prerequisites

- Node.js >= 20
- A reachable MySQL instance (only needed to run the app and integration tests)

### Installation & database setup

```bash
npm install
```

Configure the database in `config/database.js` (username, password, host — per `NODE_ENV` key; production reads `DATABASE_URL` / `CLEARDB_DATABASE_URL` for Heroku), then run migrations:

```bash
npm run sequelize db:migrate
```

### Run

```bash
npm run dev        # dev server with tsx watch (http://localhost:3000)
npm run build      # compile TypeScript to dist/
npm start          # production via PM2 cluster (runs dist/)
```

Note: `npm start` (and Heroku) run the compiled output in `dist/` — run `npm run build` first (the Heroku build does this automatically via `heroku-postbuild`).

## API

All routes are mounted under `/api`. Interactive documentation is served at **`/api/docs`** (Swagger UI).

| Method   | Endpoint        | Description            | Success |
| -------- | --------------- | ---------------------- | ------- |
| `GET`    | `/api/users`    | List users            | 200     |
| `GET`    | `/api/users/:id`| Get a user            | 200     |
| `POST`   | `/api/users`    | Create a user         | 201     |
| `PUT`    | `/api/users/:id`| Update a user         | 202     |
| `DELETE` | `/api/users/:id`| Delete a user         | 202     |

Validation failures return `400` with `{ type: 'ValidationError', details }`; unknown ids return `404` with `{ type: 'NotFoundError', details }`.

## Scripts

| Command                        | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `npm run dev`                  | Dev server (tsx watch, port 3000)                  |
| `npm run build`                | Compile TypeScript to `dist/`                      |
| `npm run typecheck`            | Type-check `src`, `config` and `test` without emit  |
| `npm start`                    | Production via PM2 cluster (`dist/`)               |
| `npm run start:single`          | Production, single process (`dist/`)               |
| `npm test`                     | Unit + integration suites                          |
| `npm run test:unit`            | Unit tests only (no database needed)               |
| `npm run test:integration`     | Integration tests only (truncates the test DB)     |
| `npm run test:unit -- test/unit/app/user/GetUser.spec.ts` | Run a single test file |
| `npm run coverage`             | c8 + mocha coverage report                        |
| `npm run lint`                 | ESLint (flat config, typescript-eslint)            |
| `npm run sequelize db:migrate` | Run migrations (sequelize-cli)                    |
| `npm run sequelize migration:generate -- --name create-foo` | Generate a migration |
| `npm run console`              | REPL with the DI container exposed as `container` |

## Testing

- **Unit tests** (`test/unit/`) mirror `src/` and mock the repository with plain objects — they run without any database.
- **Integration tests** (`test/integration/`) hit the real Express app via `test/utils/request` (supertest) and a real MySQL database. `test/setup.integration.ts` truncates the database before every test. **Caution**: this is destructive — the `test` entry in `config/database.js` points at a dedicated `clean_node_ddd_test` database, so migrate it before running (`NODE_ENV=test npm run sequelize db:migrate`).
- Test data comes from the small typed factory in `test/utils/factory.ts` (chance-based defaults over the Sequelize models).

## Roadmap

- [ ] GitHub documentation
- [x] Swagger documentation
- [ ] MongoDB support
- [ ] Passport auth
- [ ] Docker
- [ ] CI/CD pipeline
- [ ] Deploy to AWS/Heroku

## License

ISC