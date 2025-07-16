# Express Api Starter

## Prerequisites

**Node versión v22.14.0**
<br />
**pnpm versión 10.11.0**
<br />
**typescript versión 5.x.x**

## Setup the project

### Clone the repository

```shell
git clone https://github.com/psuarezdev/express-api-starter.git
```

### Install packages

```shell
pnpm i
```

### Setup .env variables

```js
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db_name>?schema=public"
API_VERSION=v1
EXPIRES_IN=1h
REFRESH_EXPIRES_IN=7d
JWT_SECRET="your_jwt_secret"
REFRESH_JWT_SECRET="your_refresh_jwt_secret"
```

### Create prisma client

```shell
pnpx prisma generate
```

### Run the app

```shell
pnpm dev
```
