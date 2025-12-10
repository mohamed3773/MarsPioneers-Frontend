// Supabase Edge Function: verify-code
// Validates the verification code and generates a session token

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { email, code } = await req.json()

    // Validate inputs
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'Invalid code format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query verification code from database
    const { data: verificationData, error: queryError } = await supabase
      .from('email_verification')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()

    if (queryError || !verificationData) {
      return new Response(
        JSON.stringify({ 
          verified: false,
          error: 'Invalid or expired verification code' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if code has expired
    const expiresAt = new Date(verificationData.expires_at)
    const now = new Date()

    if (now > expiresAt) {
      // Delete expired code
      await supabase
        .from('email_verification')
        .delete()
        .eq('id', verificationData.id)

      return new Response(
        JSON.stringify({ 
          verified: false,
          error: 'Verification code has expired. Please request a new one.' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Code is valid! Delete it from database (one-time use)
    await supabase
      .from('email_verification')
      .delete()
      .eq('id', verificationData.id)

    // Generate JWT token
    const jwtSecret = Deno.env.get('JWT_SECRET')
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not found in secrets')
      return new Response(
        JSON.stringify({ error: 'Authentication service configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create JWT payload
    const payload = {
      email: email.toLowerCase(),
      verified: true,
      iat: getNumericDate(0), // Issued at (now)
      exp: getNumericDate(60 * 60 * 24 * 7), // Expires in 7 days
    }

    // Generate crypto key for signing
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    // Create and sign JWT
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key)

    // Optional: Store user session in a sessions table
    const sessionId = crypto.randomUUID()
    await supabase
      .from('user_sessions')
      .insert({
        id: sessionId,
        email: email.toLowerCase(),
        token: token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .catch(err => console.error('Failed to store session:', err))

    // Success response with token
    return new Response(
      JSON.stringify({ 
        verified: true,
        token: token,
        email: email.toLowerCase(),
        message: 'Email verified successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

