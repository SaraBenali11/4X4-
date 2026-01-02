import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ijqhxzcsngpsodslijmd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcWh4emNzbmdwc29kc2xpam1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzMxMjgsImV4cCI6MjA4MTQwOTEyOH0.64LTSqOpeh218dCRcge9NzG45lZraOYpmlU4O15sUrA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
