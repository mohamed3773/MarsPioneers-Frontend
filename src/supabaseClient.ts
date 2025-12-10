// Supabase client setup
import { createClient } from '@supabase/supabase-js';

// Your Supabase project keys
const supabaseUrl = "https://mwlxeljisdcgzboahxxb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bHhlbGppc2RjZ3pib2FoeHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTEwOTEsImV4cCI6MjA3ODg4NzA5MX0.WnJVbb4vjB3hwYUWSZTreXTZwloVi54w9-pszT6MH1w";

// Export the client so we can use it anywhere
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
