import React from 'react';

interface NFT {
    identifier: string;
    name: string;
    description?: string;
    image_url?: string;
    rarity?: 'Legendary' | 'Ultra Rare' | 'Rare' | 'Common';
    status?: 'Available' | 'Minted' | 'sold';
}

interface PurchaseData {
    tokenId: string;
    buyerAddress: string;
    txHash: string;
    blockNumber: number;
    price: string;
    rarity: string;
    explorerUrl: string;
}

interface SimplePurchaseModalProps {
    nft: NFT;
    onClose: () => void;
    onSuccess: (purchaseData: PurchaseData) => void;
}

declare const SimplePurchaseModal: React.FC<SimplePurchaseModalProps>;

export default SimplePurchaseModal;
