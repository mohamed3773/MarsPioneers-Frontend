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
    payment: {
        network: string;
        currency: string;
        amount: string;
        txHash: string;
        explorerUrl: string;
        confirmations: number;
    };
    nftTransfer: {
        network: string;
        txHash: string;
        blockNumber: number;
        explorerUrl: string;
    };
    summary: {
        paidOn: string;
        paidWith: string;
        receivedOn: string;
        tokenId: string;
    };
}

interface MultiChainPurchaseModalProps {
    nft: NFT;
    onClose: () => void;
    onSuccess: (purchaseData: PurchaseData) => void;
}

declare const MultiChainPurchaseModal: React.FC<MultiChainPurchaseModalProps>;

export default MultiChainPurchaseModal;
