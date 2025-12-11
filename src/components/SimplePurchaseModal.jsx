import React, { useState, useEffect } from 'react';

/**
 * Simple Purchase Modal
 * Handles NFT purchase with wallet signature
 */
export default function SimplePurchaseModal({ nft, onClose, onSuccess }) {
    const [step, setStep] = useState('confirm'); // confirm, processing, success, error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [price, setPrice] = useState(null);

    const API_URL = 'https://mars-backend-69p8.onrender.com';

    // Get wallet address and price on mount
    useEffect(() => {
        connectWallet();
        fetchPrice();
    }, [nft]);

    /**
     * Connect wallet and get address
     */
    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            setError('MetaMask is not installed. Please install MetaMask to continue.');
            setStep('error');
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        } catch (err) {
            console.error('Wallet connection error:', err);
            setError('Failed to connect wallet: ' + err.message);
            setStep('error');
        }
    };

    /**
     * Fetch price from backend
     */
    const fetchPrice = async () => {
        try {
            const response = await fetch(`${API_URL}/api/purchase/price`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nftName: nft.name
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPrice(data.data);
            }
        } catch (err) {
            console.error('Price fetch error:', err);
            // Don't show error, just use default
        }
    };

    /**
     * Handle purchase
     */
    const handlePurchase = async () => {
        if (!walletAddress) {
            setError('Please connect your wallet first');
            return;
        }

        setLoading(true);
        setError(null);
        setStep('processing');

        try {
            console.log('Sending purchase request...');
            console.log('Token ID:', nft.identifier);
            console.log('Buyer Address:', walletAddress);

            const response = await fetch(`${API_URL}/api/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: nft.identifier,
                    buyerAddress: walletAddress,
                    nftName: nft.name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Purchase failed');
            }

            console.log('Purchase successful!', data);
            setPurchaseResult(data.data);
            setStep('success');

            // Notify parent component
            if (onSuccess) {
                onSuccess(data.data);
            }

        } catch (err) {
            console.error('Purchase error:', err);
            setError(err.message);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Render content based on step
     */
    const renderContent = () => {
        // Confirm step
        if (step === 'confirm') {
            return (
                <div className="space-y-6">
                    {/* NFT Details */}
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                        <div className="flex gap-4">
                            {nft.image_url && (
                                <img
                                    src={nft.image_url}
                                    alt={nft.name}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">{nft.name}</h3>
                                <p className="text-white/60 text-sm mb-2">Token ID: {nft.identifier}</p>
                                {nft.rarity && (
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${nft.rarity === 'Legendary' ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-black' :
                                            nft.rarity === 'Ultra Rare' ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white' :
                                                nft.rarity === 'Rare' ? 'bg-teal-500/20 text-teal-300' :
                                                    'bg-neutral-800 text-neutral-300'
                                        }`}>
                                        {nft.rarity}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    {price && (
                        <div className="bg-[#2A2A2A] rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-white/60">Price</span>
                                <span className="text-white font-bold text-2xl">${price.price} USD</span>
                            </div>
                            <p className="text-white/40 text-xs mt-2">Rarity: {price.rarity}</p>
                        </div>
                    )}

                    {/* Wallet Info */}
                    {walletAddress ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-green-400 text-sm">
                                ✓ Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-400 text-sm">
                                ⚠ Connecting wallet...
                            </p>
                        </div>
                    )}

                    {/* Purchase Button */}
                    <button
                        onClick={handlePurchase}
                        disabled={loading || !walletAddress}
                        className="w-full py-3 rounded-lg text-lg font-bold bg-[#FF4500] text-white hover:bg-[#FF4500]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Confirm Purchase'}
                    </button>

                    <p className="text-white/40 text-xs text-center">
                        The NFT will be transferred to your wallet address
                    </p>
                </div>
            );
        }

        // Processing step
        if (step === 'processing') {
            return (
                <div className="text-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF4500] mx-auto"></div>
                    <h3 className="text-white font-bold text-xl">Processing Purchase...</h3>
                    <p className="text-white/60">Please wait while we transfer the NFT to your wallet.</p>
                    <p className="text-white/40 text-xs">This may take a few moments...</p>
                </div>
            );
        }

        // Success step
        if (step === 'success' && purchaseResult) {
            return (
                <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-white font-bold text-2xl">🎉 Purchase Successful!</h3>
                    <p className="text-white/60">The NFT has been transferred to your wallet.</p>

                    <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-3 text-left">
                        <div className="flex justify-between">
                            <span className="text-white/60">Token ID</span>
                            <span className="text-white font-mono">{purchaseResult.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Price</span>
                            <span className="text-white">${purchaseResult.price} USD</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Transaction</span>
                            <span className="text-white font-mono text-xs">{purchaseResult.txHash.slice(0, 10)}...</span>
                        </div>
                    </div>

                    <a
                        href={purchaseResult.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-[#FF4500] text-white font-bold rounded-lg hover:bg-[#FF4500]/90 transition-all"
                    >
                        View on Polygonscan
                    </a>

                    <button
                        onClick={onClose}
                        className="block w-full py-2 text-white/60 hover:text-white transition-all"
                    >
                        Close
                    </button>
                </div>
            );
        }

        // Error step
        if (step === 'error') {
            const isConfigError = error && error.includes('not configured');

            return (
                <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-white font-bold text-xl">
                        {isConfigError ? '❌ System Not Configured' : '❌ Purchase Failed'}
                    </h3>
                    <p className="text-red-400">{error}</p>

                    {isConfigError && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
                            <p className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Configuration Required</p>
                            <p className="text-white/60 text-xs">
                                The NFT purchase system requires blockchain configuration.
                                Please check the <code className="bg-black/30 px-1 py-0.5 rounded">WEB3_PURCHASE_SETUP.md</code> file
                                for setup instructions.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {!isConfigError && (
                            <button
                                onClick={() => {
                                    setStep('confirm');
                                    setError(null);
                                }}
                                className="w-full py-3 bg-[#FF4500] text-white font-bold rounded-lg hover:bg-[#FF4500]/90 transition-all"
                            >
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-white/60 hover:text-white transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1F1F1F] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#FF4500]/20">
                {/* Header */}
                <div className="sticky top-0 bg-[#1F1F1F] border-b border-white/10 p-4 flex justify-between items-center">
                    <h2 className="text-white font-bold text-xl">Purchase NFT</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
