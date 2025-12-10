import React from 'react';

// Rarity styles helper function
const getRarityStyles = (rarity) => {
    const styles = {
        'Legendary': 'bg-gradient-to-r from-orange-500 to-amber-400 text-black border border-orange-300',
        'Ultra Rare': 'bg-gradient-to-r from-violet-600 to-orange-500 text-white border border-violet-400',
        'Rare': 'bg-teal-500/20 text-teal-300 border border-teal-500/60',
        'Common': 'bg-neutral-800 text-neutral-300 border border-neutral-600',
    };
    return styles[rarity] || styles['Common'];
};

// Rarity glow colors for card backgrounds
const getRarityGlowColor = (rarity) => {
    const glowColors = {
        'Legendary': 'from-orange-500 to-amber-400',
        'Ultra Rare': 'from-violet-600 to-orange-500',
        'Rare': 'from-teal-500 to-cyan-400',
        'Common': 'from-neutral-600 to-neutral-500',
    };
    return glowColors[rarity] || glowColors['Common'];
};

/**
 * NFTCard Component
 * Displays an individual NFT with all its details
 * 
 * @param {Object} nft - NFT data object
 * @param {Function} onViewDetails - Callback when "View Details" is clicked
 * @param {Function} onBuy - Callback when "Buy NFT" is clicked
 */
export default function NFTCard({ nft, onViewDetails, onBuy }) {
    // Extract data from the NFT object
    const {
        identifier,
        name,
        description,
        image_url,
        metadata_url,
        contract,
        token_standard,
        rarity,
        status = 'Available' // Default to Available if not provided
    } = nft;

    // Format token ID for display
    const tokenId = identifier || 'N/A';
    const displayId = tokenId.toString().padStart(4, '0');

    return (
        <div className="group bg-[#1F1F1F] rounded-xl overflow-hidden border border-[#FF4500]/20 hover:border-[#FF4500]/40 transition-all duration-300 flex flex-col">
            {/* NFT Image */}
            <div className="relative aspect-square bg-gradient-to-br from-[#2A2A2A] via-[#1F1F1F] to-[#0D0D0D] overflow-hidden">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={name || 'NFT'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRarityGlowColor(rarity)} opacity-20 blur-2xl`}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-5xl font-bold text-white/5">#{displayId}</div>
                        </div>
                    </>
                )}

                {/* Rarity Badge */}
                {rarity && (
                    <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 ${getRarityStyles(rarity)} text-[10px] font-bold rounded-md shadow-lg uppercase`}>
                            {rarity}
                        </span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 ${status === 'Available'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : status === 'Minted'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-white/10 text-white/60 border border-white/20'
                        } text-[10px] font-semibold rounded-md backdrop-blur-sm`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* NFT Name */}
                <div className="text-[#FF4500] text-xs font-semibold mb-1 tracking-wider">
                    {name || `NFT #${displayId}`}
                </div>

                {/* Description */}
                {description && (
                    <p className="text-white/60 text-xs mb-2 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Token ID */}
                <div className="text-white/40 text-[10px] font-mono mb-3 tracking-wider">
                    TOKEN ID: {displayId}
                </div>

                <div className="mt-auto space-y-2">
                    {/* View Details Button */}
                    <button
                        className="w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-[#FF4500]/30 text-white hover:bg-[#FF4500]/10"
                        onClick={() => onViewDetails && onViewDetails(nft)}
                    >
                        View Details
                    </button>

                    {/* Buy/Sold Button */}
                    {status === 'sold' ? (
                        <button
                            className="w-full py-2 rounded-lg text-sm font-bold bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                            disabled
                        >
                            Sold
                        </button>
                    ) : (
                        <button
                            className="w-full py-2 rounded-lg text-sm font-bold bg-[#FF4500]/80 text-white hover:bg-[#FF4500]/90 transition-all duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onBuy && onBuy(nft);
                            }}
                        >
                            Buy NFT
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
