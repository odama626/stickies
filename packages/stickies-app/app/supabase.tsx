import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_REST_URL,
  process.env.NEXT_PUBLIC_SUPA_ANON_KEY
);

export default supabase;
