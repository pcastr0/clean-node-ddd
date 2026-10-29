# Clean Node DDD

A Node.js REST API boilerplate implementing **Domain-Driven Design (DDD) + Clean Architecture**, built with Express and Sequelize and wired together with an Awilix dependency-injection container.

## Features

- Clean Architecture layering — domain logic isolated from frameworks and persistence
- Awilix DI container with request-scoped resolution (`scopePerRequest`)
- Use cases as `Operation` classes that communicate via EventEmitter outputs instead of return/throw
- Sequelize + MySQL persistence behind repository ports, with mappers to domain entities
- Swagger UI served from the app itself
- Promise-aware REPL console exposing the DI container
- Unit + integration test suites (Mocha/Chai) with factory-girl test data
- PM2 cluster mode for production, Heroku deployment support

## Architecture

Four layers under `src/`, all wired together in `src/container.js` (the composition root). Dependencies only point inward:

```
HTTP request
   │
   ▼
src/interfaces/http          delivery: router → controllers
   │
   ▼
src/app/                     use cases: Operations (EventEmitters)
   │
   ▼
src/infra/                   persistence: repositories, Sequelize models, mappers
   │
   ▼
src/domain/                  entities: pure business rules, validated by `structure`
```

Key ideas:

- **Operations** — every use case extends `src/app/Operation.js`, declares its outputs up front (`CreateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR'])`) and `emit()`s a payload after `execute()`. Controllers subscribe to the outputs and map them to HTTP statuses. Use cases never return or throw to their callers.
- **Composition root** — everything is registered manually in `src/container.js`. The only convention loaders are Sequelize models (`src/infra/database/models/`, any `.js` except `index.js` is auto-loaded) and test factories.
- **Request scope** — `scopePerRequest(container)` gives each HTTP request a scoped container; controllers pull dependencies with `inject(({ createUser, ... }) => ...)` from `awilix-express`.
- **Repository ports** — operations depend on the `usersRepository` interface, implemented by `SequelizeUsersRepository`, which translates Sequelize errors into domain errors (`ValidationError` / `NotFoundError`) and uses a mapper to convert rows to domain entities.
- **Serializers** — `UserSerializer` whitelists entity fields for JSON responses.

Requires are root-relative everywhere (`require('src/container')`) — `NODE_PATH=.` is set on every npm script.

## Project structure

```
├── config/                  env-based config (port, logging) + database config
├── src/
│   ├── container.js         Awilix composition root
│   ├── domain/              entities (User, validated by `structure`)
│   ├── app/                 use cases (Operation classes)
│   ├── infra/               repositories, Sequelize models, migrations, logging
│   └── interfaces/          HTTP (controllers, serializers, swagger) + REPL console
├── test/
│   ├── unit/                mirrors src/, mocks the repository
│   └── integration/          hits the real Express app via supertest
└── cluster.js               PM2 cluster entry point for production
```

## Getting started

### Prerequisites

- Node.js >= 14
- A reachable MySQL instance

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
npm run dev        # dev server with nodemon (http://localhost:3000)
npm start          # production via PM2 cluster (cluster.js)
```

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
| `npm run dev`                  | Dev server (nodemon, port 3000)                    |
| `npm start`                    | Production via PM2 cluster                         |
| `npm test`                     | Unit + integration suites                          |
| `npm run test:unit`            | Unit tests only                                    |
| `npm run test:integration`     | Integration tests only                              |
| `npm run test:unit -- test/unit/app/user/GetUser.spec.js` | Run a single test file |
| `npm run coverage`             | nyc + mocha coverage report                        |
| `npm run lint`                 | ESLint on `src`, `test`, `config`                  |
| `npm run sequelize db:migrate` | Run migrations (sequelize-cli)                    |
| `npm run sequelize migration:generate -- --name create-foo` | Generate a migration |
| `npm run console`              | REPL with the DI container exposed as `container` |

## Testing

Both suites need a reachable MySQL instance — `test/setup.js` truncates the database on every test (`beforeEach(cleanDatabase)`). **Caution**: the `test` entry in the tracked `config/database.js` points at the same database as `development` — point it at a dedicated test database before running.

Test data comes from factory-girl factories in `test/utils/factories/` (auto-loaded by `test/utils/factory.js`). Integration tests hit the real Express app via `test/utils/request` (supertest).

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