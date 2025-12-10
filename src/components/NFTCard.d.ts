import React from 'react';

export interface NFTCardProps {
    nft: {
        identifier: string;
        name: string;
        description?: string;
        image_url?: string;
        metadata_url?: string;
        contract?: string;
        token_standard?: string;
        rarity?: 'Legendary' | 'Ultra Rare' | 'Rare' | 'Common';
        status?: 'Available' | 'Minted' | 'sold';
    };
    onViewDetails?: (nft: any) => void;
    onBuy?: (nft: any) => void;
}

declare const NFTCard: React.FC<NFTCardProps>;
export default NFTCard;
