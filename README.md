# Express Api Starter

Proyecto de express con autenticación, inyección de dependencias, prisma y swagger

## Prerequisitos

**Node versión v22.14.0**
<br />
**pnpm versión 10.11.0**
<br />
**typescript versión 5.x.x**

## Configurar el proyecto

### Clonar el repositorio

```shell
git clone git@gitea.contactel.es:psuaben/express-api-starter.git
```

### Instalar paquetes

```shell
pnpm i
```

### Configurar archivo .env

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

### Crear cliente de prisma

```shell
pnpx prisma generate
```

### Ejecutar la aplicación

```shell
pnpm dev
```
