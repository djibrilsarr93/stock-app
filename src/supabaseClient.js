//import { createClient } from "@supabase/supabase-js";

//const VITE_SUPABASE_URL = "https://xqrvgeapjwmbckkozuvh.supabase.co"; // remplace par ton URL Supabase
//const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnZnZWFwandtYmNra296dXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzIyMjYsImV4cCI6MjA3MTc0ODIyNn0.4T9RuF6WAn4wDASvfGLhWFq1_Bo7qV1ZTq9F5QQVqbE";       // remplace par ta clé anonyme

//export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);




import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

