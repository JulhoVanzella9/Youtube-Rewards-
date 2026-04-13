/**
 * Supabase Browser Client
 * Uses @supabase/supabase-js for authentication and database operations
 */
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient
  supabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
  return supabaseClient
}
