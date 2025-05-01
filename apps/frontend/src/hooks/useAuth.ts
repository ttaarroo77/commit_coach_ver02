import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface UseAuthReturn {
  user: any;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = async (email: string, password: string) => {
    // 実装は後で追加
  };

  const signOut = async () => {
    // 実装は後で追加
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
  };
}

export default useAuth; 