import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import users from './routes/users.js';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/users', users);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
