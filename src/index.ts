import ModuleAlias from 'module-alias';
import { json, urlencoded } from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import expressListEndpoints from 'express-list-endpoints';
import swaggerUi from 'swagger-ui-express';
import SwaggerParser from '@apidevtools/swagger-parser';

ModuleAlias.addAlias('@', __dirname);

import container from './di/container';
import { authenticate } from './middlewares/auth';
import logger from './lib/logger';
import { NODE_ENV, PORT, API_PREFIX } from './lib/config';

const port = PORT || 4000;
const server = new InversifyExpressServer(container, null, { rootPath: API_PREFIX });

server.setConfig(async (app) => {
  app.set('trust proxy', 1);
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(pinoHttp({ logger }));
  app.use(authenticate);

  try {
    const swaggerDoc = await SwaggerParser.dereference('docs/swagger.yml');
    app.use(`${API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    logger.info('Swagger initialized');
  } catch (err: any) {
    logger.warn(`Error initializing Swagger: ${err?.message}`);
  }
});

const app = server.build();
const endpoints = expressListEndpoints(app);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`API URL: http://localhost:${port}${API_PREFIX}`);
  logger.info(`Swagger docs: http://localhost:${port}${API_PREFIX}/docs`);
  logger.info(`Available Endpoints:`);
  endpoints.slice(1).forEach(endpoint => {
    logger.info(`${endpoint.methods.join(', ')} ${endpoint.path}`);
  });
});