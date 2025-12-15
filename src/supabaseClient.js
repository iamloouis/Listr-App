import { createClient } from '@supabase/supabase-js'

// Go to Supabase > Settings > API to find these
const supabaseUrl = 'https://lkeocuivyjfnavtfxvnu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZW9jdWl2eWpmbmF2dGZ4dm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjk4NzIsImV4cCI6MjA4MTQwNTg3Mn0.tMJXhxjuFzVUnOifK1lJMMR-nUcr4yINWAW_XbdbP90'

export const supabase = createClient(supabaseUrl, supabaseKey)