// Importataan Supabase Node module
import { createClient } from '@supabase/supabase-js'

// Luodaan yksittäinen Supabase client tietokantaan
export const supabase = createClient(process.env.SUPABASE_DB_URL, process.env.SUPABASE_DB_API_KEY)


