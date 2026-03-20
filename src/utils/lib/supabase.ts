// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = 'https://iygwvcexnvbxsbmafiis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z3d2Y2V4bnZieHNibWFmaWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDc5NzUsImV4cCI6MjA4OTU4Mzk3NX0.vWDhJT9HiGMRFOy6eiYxZF05buECvfTlRvEy5Geyei4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);