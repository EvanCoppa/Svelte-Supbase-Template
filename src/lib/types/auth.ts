import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'buyer' | 'artist' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  user: User;
  profile?: UserProfile;
}

export interface AuthState {
  session: SessionData | null;
}