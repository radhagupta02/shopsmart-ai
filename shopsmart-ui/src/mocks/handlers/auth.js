import { findUserByEmail } from '../data/users.js';
import { createMockError } from '../errors.js';

export function handleLogin({ body }) {
  const { email, password } = body || {};
  if (!email || !password) {
    throw createMockError('Email and password are required', 400, [
      ...(!email ? [{ field: 'email', message: 'Email is required' }] : []),
      ...(!password ? [{ field: 'password', message: 'Password is required' }] : []),
    ]);
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    throw createMockError('Invalid email or password', 401);
  }

  return {
    token: user.token,
    user: {
      id: user.id,
      name: user.name,
      tier: user.tier,
      role: user.role,
    },
  };
}
