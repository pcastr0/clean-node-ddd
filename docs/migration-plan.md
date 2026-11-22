# Migrate clean-node-ddd to TypeScript (with architecture deepening)

## Context

The repo is a small DDD/Clean-Architecture Node REST boilerplate (one feature: User CRUD), last modernized in 2021. The user wants to modernize it and move to TypeScript. A recent architecture review found the codebase's biggest friction: the Operation/EventEmitter module (shallow — fails the deletion test) and magic-string error conventions crossing the repository seam. Since a TS conversion touches every file anyway, the user chose to fold the two Strong refactors in rather than migrate 1:1.

## Decisions (confirmed by user)

1. **TS + top refactors**: dissolve the Operation/EventEmitter pattern (use cases become plain async classes that return or throw) and introduce typed errors at the repository seam (`ValidationError`/`NotFoundError` + one error→HTTP-status mapping). Delete dead domain code (`age`/`isLegal`). `cleanDatabase` moves to the integration config only.
2. **Full dependency refresh**: Express 4→5, Sequelize latest, Mocha 11/Chai 4, ESLint 9 flat config + typescript-eslint, engines → Node >= 20.
3. **strict: true** from the start.
4. **Tests converted to TS** too.

## Toolchain & key design choices

| Concern | Choice | Why |
|---|---|---|
| Imports | **Relative imports; retire `NODE_PATH=.` entirely** | Only option that works identically under tsx (dev/test) and plain `node dist/` (PM2/Heroku) with no runtime shims or build-time alias rewriting. CLAUDE.md's module-resolution section gets rewritten (step 8). |
| Module format | **CommonJS** | sequelize-cli `require()`s its config and generates CJS migrations; keeps chai@4 viable; express 5/sequelize work fine as CJS. |
| Dev runner | `tsx watch src/index.ts` | Replaces nodemon + ts-node (both dropped). |
| Build | `tsc` → `dist/` (`rootDir: "."` so dist mirrors repo: `dist/index.js`, `dist/src/…`, `dist/config/…`) | No bundler — dynamic `require`s in ModelsLoader make bundlers a liability. |
| Tests | Mocha 11 + `require: 'tsx/cjs'` hook, specs `**/*.spec.ts` | Least churn; assertion vocabulary unchanged. |
| Coverage | c8 (replaces nyc; drop `.nycrc`) | nyc can't instrument TS-via-tsx. |
| Lint | ESLint 9 flat config + typescript-eslint 8 | Per user decision; delete `.eslintrc.js`. |
| sequelize-cli | `config/database.js` **stays CJS JavaScript**; migrations stay `.js` | sequelize-cli can't read TS. `.sequelizerc` unchanged. `allowJs: true` in tsconfig emits it into `dist/config/`. Everything else in `config/` becomes TS. |
| DI typing | `Cradle` interface + `createContainer<Cradle>()` (awilix ships native types) | `container.resolve('usersRepository')` and `cradle.createUser` become fully typed; `Express.Request` augmentation types `req.container`. |
| Controllers | Keep awilix-express for `scopePerRequest` + `inject()`; each controller module exports a ready `Router()`; **delete `createControllerRoutes` string-path resolver** (review card 5 folded in) — router imports controllers directly. |

**Dependencies**: add `typescript ^5, tsx, c8, @types/{node,express,chai,chance,swagger-ui-express}`; upgrade `express ^5.3, awilix ^13, awilix-express ^11, sequelize ^6.37, mysql2 ^3, mocha ^11, supertest ^7, chai ^4.5 (pinned — chai 5 is ESM-only), http-status, log4js, swagger-ui-express ^5`. **Drop**: `structure`, `factory-girl` (+ `src/infra/factoryGirl/` loader), `chai-change`, `dirty-chai`, `supertest-as-promised`, `express-status-monitor` (breaks on Express 5; delete its router block), `body-parser` (→ `express.json()`), `nodemon`, `nyc`. `engines: >=20`, `main: dist/index.js`.

## Implementation steps (commit per step)

### 0. Copy this plan into the repo
- Write this plan to `docs/migration-plan.md` as the first action, so the review and decisions travel with the code.

### 1. Tooling scaffold
- Add `tsconfig.json` (strict, CJS, `rootDir: "."`, `outDir: dist`, `allowJs: true`, `resolveJsonModule`) and `tsconfig.test.json` (`noEmit`, includes `test/**/*`). Add `eslint.config.js` (flat, typescript-eslint recommended + `no-floating-promises`/`no-misused-promises`).
- Rewrite `package.json`: deps above, engines, scripts — remove `NODE_PATH=.` from **every** script; `dev: tsx watch src/index.ts`, `build: tsc -p tsconfig.json`, `typecheck: tsc -p tsconfig.test.json`, `start: node dist/cluster.js`, `coverage: c8 -x 'src/container.ts' -x 'src/app/Application.ts' -x 'src/interfaces/http/**' mocha …`. `heroku-postbuild` gains `npm run build`. Delete `.eslintrc.js`.

### 2. Domain + typed errors
- Add `src/domain/errors/{ValidationError,NotFoundError,index}.ts`: `ValidationError` with `details: { message, path }[]`, `NotFoundError` with `details: string`. Keep `.message` = class name for contract parity.
- Rewrite `src/domain/user/User.js` → `.ts`: plain class, hand-rolled `validate()` → `{ valid, errors }`. **Must reproduce structure's exact messages** (asserted in integration specs): `'"firstName" is required'`, `'"firstName" is not allowed to be empty'`, `'"email" must be a valid email'` with `path: ['email']`. Delete dead `age` + `isLegal()` + `MIN_LEGAL_AGE`.
- Add port interface `src/domain/user/UsersRepository.ts` (`getAll/getById/add/update/remove/count`).

### 3. Infra
- Rewrite to `.ts`: `src/infra/user/SequelizeUsersRepository.ts` (implements the port; throws the typed error classes; also owns the `attributes` projection itself per review card 4 — stop forwarding Sequelize options), `SequelizeUserMapper.ts`, `src/infra/database/models/{index,user}.ts`, `src/infra/sequelize/{ModelsLoader,index}.ts`, `src/infra/logging/{logger,LoggerStreamAdapter}.ts`.
- Delete `src/infra/factoryGirl/*` and `src/infra/utils/dataFaker.js` (moves to `test/utils/dataFaker.ts` in step 7).
- Plumb `database: Sequelize | undefined` explicitly (strict TS will catch the silent no-DB branch; fail loudly at startup when DB config is absent but requested).

### 4. App use cases (Operation dissolved)
- Rewrite `src/app/user/{CreateUser,GetUser,GetAllUsers,UpdateUser,DeleteUser}.ts`: tiny async classes, `async execute(...): Promise<User>` returning or throwing — **no try/catch, no emit**. E.g. `CreateUser.execute(userData)` = `return this.usersRepository.add(new User(userData))`.
- Delete `src/app/Operation.js` and its spec.
- Rewrite `src/app/Application.ts` (make `database: Sequelize | undefined` explicit).

### 5. Interfaces (HTTP + console)
- Add `src/interfaces/http/errors/domainErrorResponder.ts` — the single error→status mapping (`ValidationError` → 400 `{ type, details }`, `NotFoundError` → 404, else `next(err)`); response JSON byte-identical to today.
- Rewrite to `.ts`: `Server.ts`, `router.ts` (direct controller imports, `express.json()`, status-monitor block deleted), `user/UsersController.ts` (handlers = `inject(({ getUser, userSerializer }) => async (req,res,next) => { try { … await getUser.execute(…) } catch (err) { handleDomainError(err, res, next) } })`, exports `usersRouter`), `user/UserSerializer.ts`, `errors/{errorHandler,devErrorHandler}.ts`, `logging/loggerMiddleware.ts`, `swagger/swaggerMiddleware.ts`, `src/interfaces/console/*`. `swagger.json` untouched.
- Delete `src/interfaces/http/utils/createControllerRoutes.js`.
- Unify env flags: `config.isDevelopment/isTest/isProduction` replace `config.env === 'development'` and `config.production`.

### 6. Composition root + entry points
- Rewrite `src/container.ts` (+ `Cradle` interface + Express `Request` augmentation), `index.ts`, `cluster.ts` (script: `dist/index.js`; drop `NODE_PATH` from pm2 env). Config: `config/index.ts` + `config/environments/*.ts` (typed `Config`, static `Record<NodeEnv, EnvConfig>` instead of dynamic require); `config/database.js` stays JS. `.sequelizerc`, `Procfile` unchanged.

### 7. Tests
- `test/.mocharc.{unit,integration}.js`: `require: 'tsx/cjs'`, `spec: **/*.spec.ts`. **Unit mocharc has no setup file** (kills the "unit tests need MySQL" footgun); integration gets `test/setup.integration.ts` with `beforeEach(cleanDatabase)`.
- Rewrite `test/utils/{cleanDatabase,request}.ts`, add `test/utils/factory.ts` (hand-rolled `create/createMany` over `UserModel.create` with chance defaults) + `dataFaker.ts`, rewrite `test/utils/factories/user.ts`.
- Port + rewrite all specs to async return/throw style: `instanceof ValidationError` assertions instead of message strings; drop `.alter()` (5 uses) → before/after `count()` comparisons; `expect.fail` on missing throw. Fix the known copy-paste bugs (`done()` never declared, NOT_FOUND block subscribing VALIDATION_ERROR) as each spec is rewritten.
- **Fix the test-DB footgun**: point `config/database.js`'s `test` entry at a dedicated scratch database instead of the same DB as `development`.

### 8. Docs
- Rewrite `CLAUDE.md` (module resolution → relative imports, commands, architecture: Operation/emit section becomes the use-case/error-contract section, testing conventions) and `README.md`. Note Heroku must install devDependencies for `heroku-postbuild` to build.

## Verification

1. `npm run typecheck` and `npm run lint` — zero errors.
2. `npm run build` — `dist/` mirrors repo incl. `dist/config/database.js`; `npm start` boots the PM2 cluster off `dist/cluster.js`; `npm run start:single` boots too.
3. `npm run test:unit` — green **without MySQL running** (proof of review card 6).
4. `npm run test:integration` — green against a scratch MySQL DB (truncates per CLAUDE.md caution).
5. `npm run dev` — boots on :3000; `GET /api/users` → `[]`; `POST /api/users` with empty body → 400 with the exact 5 `'"x" is required'` details (contract parity); `GET /api/docs` serves Swagger; `npm run console` resolves `container.cradle.createUser` and awaits `execute()`.
6. `NODE_ENV=production` run swaps to the prod error handler (no stack in 500 body).

## Risks / flags

- **Validation-message parity** is the main correctness risk: integration specs pin structure's exact strings; hand-rolled `validate()` must reproduce them or tests fail (that's the safety net working).
- **chai 4 EOL pin** — conscious trade for CJS; revisit if the project ever moves ESM.
- **Pre-existing spec bugs** (async thunks to `.alter()`, assertion-less try/catch) will surface during the port — fixing them is in scope (step 7).
- **`npm start` without `npm run build`** fails on missing `dist/` — README note + keep `build` in `heroku-postbuild`.
- `supertest-as-promised` was already dead weight (supertest is promise-aware) — dropped, integration specs just gain `async`.