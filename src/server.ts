import 'module-alias/register';
import 'tsconfig-paths/register';
import 'reflect-metadata';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import logger from './lib/logger';
import app from './app';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
  const routes = listEndpoints(app);
  logger.info('Registered Routes:');
  routes.forEach(route => {
    route.methods.forEach(method => {
      logger.info(`${method.toUpperCase()} ${route.path}`);
    });
  });
});
