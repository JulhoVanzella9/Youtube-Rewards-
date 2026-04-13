/**
 * Supabase Server Client
 * For use in API routes and server-side operations
 */
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient(): SupabaseClient {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
}
