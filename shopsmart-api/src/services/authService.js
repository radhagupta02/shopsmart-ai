import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const login = async (email, password) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const payload = {
    id: user.id,
    tier: user.tier,
    role: user.role
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_TTL });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      tier: user.tier,
      role: user.role
    }
  };
};
