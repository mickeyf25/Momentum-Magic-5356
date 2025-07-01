import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

if(SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  console.warn('Supabase not configured - using local storage');
}

let supabase = null;
try {
  if(SUPABASE_URL !== 'https://your-project-id.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
} catch (error) {
  console.warn('Supabase initialization failed:', error);
}

export default supabase;