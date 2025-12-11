import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * PurchaseModal Component
 * Handles the complete NFT purchase flow with MetaMask payment
 */
export default function PurchaseModal({ nft, onClose, onSuccess }) {
    const [step, setStep] = useState('quote'); // quote, payment, processing, success, error
    const [priceQuote, setPriceQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentTxHash, setPaymentTxHash] = useState(null);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const [userAddress, setUserAddress] = useState(null);

    const API_URL = 'https://mars-backend-69p8.onrender.com';

    // Get price quote on mount
    useEffect(() => {
        fetchPriceQuote();
        checkWalletConnection();
    }, [nft]);

    /**
     * Check if wallet is connected
     */
    const checkWalletConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setUserAddress(accounts[0].address);
                }
            } catch (err) {
                console.error('Error checking wallet:', err);
            }
        }
    };

    /**
     * Connect MetaMask wallet
     */
    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            setError('MetaMask is not installed. Please install MetaMask to continue.');
            return null;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setUserAddress(address);
            return { provider, signer, address };
        } catch (err) {
            setError('Failed to connect wallet: ' + err.message);
            return null;
        }
    };

    /**
     * Fetch price quote from backend
     */
    const fetchPriceQuote = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/purchase/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: nft.identifier,
                    nftName: nft.name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Show more detailed error message
                const errorMsg = data.message || data.error || 'Failed to get price quote';
                throw new Error(errorMsg);
            }

            setPriceQuote(data.data);
        } catch (err) {
            console.error('Price quote error:', err);
            setError(err.message);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle payment via MetaMask
     */
    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Connect wallet if not connected
            let walletInfo = { address: userAddress };
            if (!userAddress) {
                walletInfo = await connectWallet();
                if (!walletInfo) return;
            } else {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                walletInfo = { provider, signer, address: userAddress };
            }

            // Prepare transaction
            const tx = {
                to: priceQuote.serverWallet,
                value: ethers.parseEther(priceQuote.priceMatic.toString()),
                from: walletInfo.address
            };

            console.log('Sending payment transaction:', tx);

            // Send transaction
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const txResponse = await signer.sendTransaction(tx);

            console.log('Payment transaction sent:', txResponse.hash);
            setPaymentTxHash(txResponse.hash);
            setStep('processing');

            // Wait for confirmation
            console.log('Waiting for payment confirmation...');
            await txResponse.wait();

            console.log('Payment confirmed! Executing NFT transfer...');

            // Execute NFT purchase
            await executePurchase(walletInfo.address, txResponse.hash);

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Execute NFT purchase on backend
     */
    const executePurchase = async (buyerAddress, txHash) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: nft.identifier,
                    buyerAddress: buyerAddress,
                    nftName: nft.name,
                    paymentTxHash: txHash
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Purchase failed');
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
     * Render different steps
     */
    const renderContent = () => {
        // Loading state
        if (loading && step === 'quote') {
            return (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4500] mx-auto mb-4"></div>
                    <p className="text-white/60">Loading price quote...</p>
                </div>
            );
        }

        // Quote step
        if (step === 'quote' && priceQuote) {
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
                                <span className={`px-2 py-1 text-xs font-bold rounded ${priceQuote.rarity === 'Legendary' ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-black' :
                                    priceQuote.rarity === 'Ultra Rare' ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white' :
                                        priceQuote.rarity === 'Rare' ? 'bg-teal-500/20 text-teal-300' :
                                            'bg-neutral-800 text-neutral-300'
                                    }`}>
                                    {priceQuote.rarity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Price (USD)</span>
                            <span className="text-white font-bold text-xl">${priceQuote.priceUsd}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">Price (MATIC)</span>
                            <span className="text-white font-bold text-xl">{parseFloat(priceQuote.priceMatic).toFixed(4)} MATIC</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">MATIC Price</span>
                            <span className="text-white/40">${priceQuote.maticPriceUsd.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Wallet Status */}
                    {userAddress ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-green-400 text-sm">
                                ✓ Wallet Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-400 text-sm">
                                ⚠ Wallet not connected. You'll be prompted to connect when purchasing.
                            </p>
                        </div>
                    )}

                    {/* Purchase Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-3 rounded-lg text-lg font-bold bg-[#FF4500] text-white hover:bg-[#FF4500]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Purchase with MetaMask'}
                    </button>

                    <p className="text-white/40 text-xs text-center">
                        You will be prompted to approve the payment in MetaMask
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
                    {paymentTxHash && (
                        <div className="bg-[#2A2A2A] rounded-lg p-4 mt-4">
                            <p className="text-white/60 text-sm mb-2">Payment Transaction:</p>
                            <a
                                href={`https://polygonscan.com/tx/${paymentTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF4500] text-sm hover:underline break-all"
                            >
                                {paymentTxHash}
                            </a>
                        </div>
                    )}
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
                    <h3 className="text-white font-bold text-2xl">Purchase Successful!</h3>
                    <p className="text-white/60">The NFT has been transferred to your wallet.</p>

                    <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-3 text-left">
                        <div className="flex justify-between">
                            <span className="text-white/60">Token ID</span>
                            <span className="text-white font-mono">{purchaseResult.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Price Paid</span>
                            <span className="text-white">${purchaseResult.priceUsd} ({parseFloat(purchaseResult.priceMatic).toFixed(4)} MATIC)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">Block Number</span>
                            <span className="text-white font-mono">{purchaseResult.blockNumber}</span>
                        </div>
                    </div>

                    <a
                        href={purchaseResult.polygonScanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-[#FF4500] text-white font-bold rounded-lg hover:bg-[#FF4500]/90 transition-all"
                    >
                        View on PolygonScan
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
                        {isConfigError ? 'System Not Configured' : 'Purchase Failed'}
                    </h3>
                    <p className="text-red-400">{error}</p>

                    {isConfigError && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
                            <p className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Configuration Required</p>
                            <p className="text-white/60 text-xs">
                                The NFT purchase system requires blockchain configuration.
                                Please check the <code className="bg-black/30 px-1 py-0.5 rounded">QUICK_SETUP_PURCHASE.md</code> file
                                in the project root for setup instructions.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {!isConfigError && (
                            <button
                                onClick={() => {
                                    setStep('quote');
                                    setError(null);
                                    fetchPriceQuote();
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
