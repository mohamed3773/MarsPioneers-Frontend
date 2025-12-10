import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAccount } from 'wagmi';

const MyNFTs: React.FC = () => {
    const navigate = useNavigate();
    const { address: walletAddress } = useAccount();

    // Feature is "Coming Soon" - No fetching
    const userNFTs: any[] = [];
    const loading = false;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pt-32 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back to Dashboard Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-2"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My NFTs</h1>
                    <p className="text-gray-400">
                        {walletAddress
                            ? `Your personal NFT collection (${userNFTs.length} NFTs)`
                            : 'Connect your wallet to view your NFT collection'
                        }
                    </p>
                    {/* DEBUG: Show wallet address */}
                    {walletAddress && (
                        <p className="text-xs text-gray-500 mt-2">
                            Wallet: {walletAddress}
                        </p>
                    )}
                    {!walletAddress && (
                        <p className="text-xs text-red-500 mt-2">
                            ⚠️ No wallet detected! Please connect your wallet.
                        </p>
                    )}
                </div>

                {/* Coming Soon Banner */}
                <div className="mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">🚧 Coming Soon</h3>
                            <p className="text-gray-300 mb-2">
                                The <span className="font-semibold text-orange-400">My NFTs</span> and <span className="font-semibold text-orange-400">Sell NFT</span> features are currently under development.
                            </p>
                            <p className="text-sm text-gray-400">
                                Stay tuned! We're working hard to bring you the ability to view, manage, and sell your NFTs directly from this platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Not Connected State */}
                {!walletAddress && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-6">
                            <Package className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">Connect Your Wallet</h2>
                        <p className="text-gray-400 text-center max-w-md mb-8">
                            Please connect your wallet to view your NFT collection.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyNFTs;
