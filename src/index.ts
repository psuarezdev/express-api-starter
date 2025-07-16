import ModuleAlias from 'module-alias';
import dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { pinoHttp } from 'pino-http';
import { InversifyExpressServer } from 'inversify-express-utils';
import expressListEndpoints from 'express-list-endpoints';
import swaggerUi from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';
import cors from 'cors';

dotenv.config();
ModuleAlias.addAlias('@', __dirname);

import container from './di/container';
import { authenticate } from './middlewares/auth';
import logger from './lib/logger';

const port = process.env.PORT || 4000;
const apiVersion = process.env.API_VERSION || 'v1';
const server = new InversifyExpressServer(container, null, { rootPath: `/api/${apiVersion}` });

server.setConfig(app => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors());
  app.use(pinoHttp({ logger }));
  app.use(authenticate);
});

const app = server.build();
const endpoints = expressListEndpoints(app);

const initServer = async () => {
  try {
    const swaggerDoc = await SwaggerParser.dereference('docs/swagger.yml');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    logger.info('Swagger initialized');
  } catch (err: any) {
    logger.warn(`Error initializing Swagger: ${err?.message}`);
  }

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`API URL: http://localhost:${port}`);
    logger.info(`Swagger docs: http://localhost:${port}/docs`);
    logger.info(`Available Endpoints:`);
    endpoints.slice(1).forEach(endpoint => {
      logger.info(`${endpoint.methods.join(', ')} ${endpoint.path}`);
    });
  });
};

initServer();
