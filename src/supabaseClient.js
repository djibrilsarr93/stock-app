import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xqrvgeapjwmbckkozuvh.supabase.co"; // remplace par ton URL Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnZnZWFwandtYmNra296dXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzIyMjYsImV4cCI6MjA3MTc0ODIyNn0.4T9RuF6WAn4wDASvfGLhWFq1_Bo7qV1ZTq9F5QQVqbE";       // remplace par ta clé anonyme

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
