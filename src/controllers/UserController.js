import { hash, compare } from 'bcrypt';
import { createToken } from '../lib/jwt.js';
import User from '../models/User.js';

export async function all(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
}

export async function create(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    const emailExists = await User.findOne({
      where: { email }
    });

    if (emailExists) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    const userCreated = await User.create({
      name,
      email,
      password: await hash(password, 10)
    });

    const { password: _, ...user } = userCreated.dataValues;
    const token = createToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const userFound = await User.findOne({
      where: { email }
    });

    if (!userFound || !(await compare(password, userFound.password))) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const { password: _, ...user } = userFound.dataValues;
    const token = createToken(user);

    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
}