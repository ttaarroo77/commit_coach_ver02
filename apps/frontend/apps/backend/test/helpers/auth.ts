import { createTestClient } from '../../src/config/database';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

export const createTestUser = async (email: string, password: string) => {
  const supabase = createTestClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

export const createTestToken = (userId: string) => {
  return sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const getTestHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const cleanupTestUser = async (email: string) => {
  const supabase = createTestClient();
  const {
    data: { user },
  } = await supabase.auth.signInWithPassword({
    email,
    password: 'test-password',
  });

  if (user) {
    await supabase.auth.admin.deleteUser(user.id);
  }
};
