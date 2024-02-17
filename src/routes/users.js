import { Router } from 'express';
import { all, login, create } from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, all);

router.post('/', create);
router.post('/login', login);

export default router;
