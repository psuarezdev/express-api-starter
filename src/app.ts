import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { loadControllers } from 'awilix-express';
import { loadContainer } from '@/lib/container';
import { authenticate } from './middlewares/auth';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(authenticate);

export const container = loadContainer(app);

app.use(loadControllers(
  '**/*.controller.{ts,js}',
  { cwd: __dirname }
));

export default app;
