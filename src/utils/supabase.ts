import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ''
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''

export const supabase =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('YOUR_') &&
  !supabaseUrl.includes('YOUR_')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

