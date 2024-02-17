import jwt from 'jsonwebtoken';
import moment from 'moment';

export default function auth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ 
        message: 'Unauthorized'
      });
    }
  
    const token = req.headers.authorization.replace(/['"]+/g, '')
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    console.log(payload);

    if(payload.exp <= moment().unix()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
}