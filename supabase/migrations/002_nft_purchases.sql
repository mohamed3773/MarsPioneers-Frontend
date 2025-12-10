-- Create NFT purchases table
CREATE TABLE IF NOT EXISTS nft_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    tx_hash TEXT NOT NULL UNIQUE,
    price_usd DECIMAL(10, 2) NOT NULL,
    price_matic DECIMAL(18, 8) NOT NULL,
    rarity TEXT NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_nft_purchases_token_id ON nft_purchases(token_id);
CREATE INDEX IF NOT EXISTS idx_nft_purchases_buyer_address ON nft_purchases(buyer_address);
CREATE INDEX IF NOT EXISTS idx_nft_purchases_tx_hash ON nft_purchases(tx_hash);

-- Enable Row Level Security
ALTER TABLE nft_purchases ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read purchases
CREATE POLICY "Allow public read access" ON nft_purchases
    FOR SELECT USING (true);

-- Create policy to allow insert (backend will use service role key)
CREATE POLICY "Allow insert for authenticated users" ON nft_purchases
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nft_purchases_updated_at
    BEFORE UPDATE ON nft_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
