import React from 'react';

interface NFT {
    identifier: string;
    name: string;
    description?: string;
    image_url?: string;
    metadata_url?: string;
    contract?: string;
    token_standard?: string;
    rarity?: 'Legendary' | 'Ultra Rare' | 'Rare' | 'Common';
    status?: 'Available' | 'Minted' | 'sold';
}

interface PurchaseData {
    tokenId: string;
    buyerAddress: string;
    txHash: string;
    blockNumber: number;
    priceUsd: number;
    priceMatic: string;
    rarity: string;
    purchaseId: string;
    polygonScanUrl: string;
}

interface PurchaseModalProps {
    nft: NFT;
    onClose: () => void;
    onSuccess: (purchaseData: PurchaseData) => void;
}

declare const PurchaseModal: React.FC<PurchaseModalProps>;

export default PurchaseModal;
