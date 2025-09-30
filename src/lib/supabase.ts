import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    global: {
      fetch,
    },
  }
);