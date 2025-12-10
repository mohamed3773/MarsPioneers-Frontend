// Supabase Edge Function: send-verification-code
// Generates a 6-digit verification code and sends it via Brevo SMTP

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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
    const { email } = await req.json()

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Calculate expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store verification code in database
    const { error: dbError } = await supabase
      .from('email_verification')
      .insert({
        email: email.toLowerCase(),
        code: code,
        expires_at: expiresAt
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Brevo API key from Supabase secrets
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!brevoApiKey) {
      console.error('Brevo API key not found in secrets')
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send email via Brevo SMTP API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Mars Pioneers 2040',
          email: 'noreply@marspioneers.com' // Replace with your verified sender email
        },
        to: [
          {
            email: email,
            name: 'Pioneer'
          }
        ],
        subject: 'Your Mars Pioneers Verification Code',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #0D0D0D;
                color: #ffffff;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                color: #FF4500;
              }
              .content {
                background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                border: 1px solid #FF4500;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #FF4500;
              }
              .message {
                font-size: 16px;
                color: #cccccc;
                margin-bottom: 30px;
                line-height: 1.5;
              }
              .code-box {
                background: #0D0D0D;
                border: 2px solid #FF4500;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
              }
              .code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #FF4500;
                font-family: 'Courier New', monospace;
              }
              .expiry {
                font-size: 14px;
                color: #888888;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🚀 Mars Pioneers 2040</div>
              </div>
              <div class="content">
                <div class="title">Verification Code</div>
                <div class="message">
                  Welcome to Mars Pioneers! Use the code below to complete your authentication:
                </div>
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                <div class="expiry">
                  This code will expire in 5 minutes.
                </div>
              </div>
              <div class="footer">
                <p>If you didn't request this code, please ignore this email.</p>
                <p>&copy; 2024 Mars Pioneers 2040. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text()
      console.error('Brevo API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Verification code sent successfully'
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

