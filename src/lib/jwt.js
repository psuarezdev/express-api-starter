import jwt from 'jsonwebtoken';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

export const createToken = (user) => {
  if(!user) return null;
  
  const { id, name, email } = user;

  const payload = {
    id,
    name,
    email,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};
