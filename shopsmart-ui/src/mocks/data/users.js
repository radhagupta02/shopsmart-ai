/**
 * Mock demo users per CONTRACT Section 7.
 * 3 demo users (Basic, Prime, Premium) + 1 admin.
 */
export const USERS = [
  {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@shopsmart.ai',
    password: 'Admin@123',
    tier: 'PREMIUM',
    role: 'ADMIN',
    token: 'mock-token-admin',
  },
  {
    id: 'usr_basic',
    name: 'Basic User',
    email: 'basic@demo.com',
    password: 'Demo@123',
    tier: 'BASIC',
    role: 'CUSTOMER',
    token: 'mock-token-basic',
  },
  {
    id: 'usr_prime',
    name: 'Prime User',
    email: 'prime@demo.com',
    password: 'Demo@123',
    tier: 'PRIME',
    role: 'CUSTOMER',
    token: 'mock-token-prime',
  },
  {
    id: 'usr_premium',
    name: 'Premium User',
    email: 'premium@demo.com',
    password: 'Demo@123',
    tier: 'PREMIUM',
    role: 'CUSTOMER',
    token: 'mock-token-premium',
  },
];

export function findUserByEmail(email) {
  return USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
}

export function findUserByToken(token) {
  if (!token) return USERS[2]; // Default to Prime user for convenience in mock browsing
  return USERS.find((u) => u.token === token) || USERS[2];
}
