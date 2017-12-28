[![Build Status](https://travis-ci.org/ElisaBaum/maple-backend.svg?branch=develop)](https://travis-ci.org/ElisaBaum/maple-backend)

# maple-backend

## Installation

### Requirements
[node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/)  are required

### Dependencies
```shell
npm install
```

## Database migrations
⚠️ Environment variables need to be set up before running migrations.
(e.g. `DB_HOST=localhost DB_NAME=... npm run migrate`)

#### Create migration
```shell
npm run create-migration -- NAME_OF_MIGRATION
```

#### Migrate up
```shell
npm run migrate
```

#### Migrate down (reverts the last migration)
```shell
npm run migrate-down
```

## Testing
Run tests

```shell
npm test
```

Test configurations can be found in `/test` directory.

### Code coverage
Run tests with code coverage

```shell
npm run cover
```
Code coverage requirements are defined in `package.json` under `nyc`.

### Linting
tslint is used and is configured in `tslint.json`.
