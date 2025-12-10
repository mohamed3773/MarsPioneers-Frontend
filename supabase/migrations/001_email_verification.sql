-- Database Schema for Email Verification System
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create email_verification table
CREATE TABLE IF NOT EXISTS email_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verification(email);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_email_verification_expires_at ON email_verification(expires_at);

-- Create user_sessions table (optional, for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions(email);

-- Create index on token for validation
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);

-- Enable Row Level Security (RLS)
ALTER TABLE email_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only service role can access email_verification
CREATE POLICY "Service role only" ON email_verification
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policy: Only service role can access user_sessions
CREATE POLICY "Service role only" ON user_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to automatically clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verification
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired codes every hour
-- Note: This requires pg_cron extension which may not be available on all Supabase plans
-- Alternatively, call these cleanup functions from your edge functions

-- Grant necessary permissions
GRANT ALL ON email_verification TO service_role;
GRANT ALL ON user_sessions TO service_role;

-- Add comments for documentation
COMMENT ON TABLE email_verification IS 'Stores temporary email verification codes';
COMMENT ON COLUMN email_verification.email IS 'Email address awaiting verification';
COMMENT ON COLUMN email_verification.code IS '6-digit verification code';
COMMENT ON COLUMN email_verification.expires_at IS 'Expiration timestamp (5 minutes from creation)';

COMMENT ON TABLE user_sessions IS 'Stores active user sessions after email verification';
COMMENT ON COLUMN user_sessions.email IS 'Verified email address';
COMMENT ON COLUMN user_sessions.token IS 'JWT session token';
COMMENT ON COLUMN user_sessions.expires_at IS 'Session expiration timestamp';

