import { useState, useEffect } from 'react';
import { Users, Award, Zap, X, ChevronDown, ChevronUp } from 'lucide-react';
import NFTCard from './NFTCard';
import MultiChainPurchaseModal from './MultiChainPurchaseModal';

// Rarity type definition
type Rarity = 'Legendary' | 'Ultra Rare' | 'Rare' | 'Common';

// NFT interface matching API response
interface NFT {
    identifier: string;
    name: string;
    description?: string;
    image_url?: string;
    metadata_url?: string;
    contract?: string;
    token_standard?: string;
    rarity?: Rarity;
    status?: 'Available' | 'Minted' | 'sold';
}

// Rarity styles helper function (used in modal)
const getRarityStyles = (rarity: Rarity): string => {
    const styles = {
        'Legendary': 'bg-gradient-to-r from-orange-500 to-amber-400 text-black border border-orange-300',
        'Ultra Rare': 'bg-gradient-to-r from-violet-600 to-orange-500 text-white border border-violet-400',
        'Rare': 'bg-teal-500/20 text-teal-300 border border-teal-500/60',
        'Common': 'bg-neutral-800 text-neutral-300 border border-neutral-600',
    };
    return styles[rarity];
};

export default function NFTCollection() {
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    const [purchaseNFT, setPurchaseNFT] = useState<NFT | null>(null); // NFT being purchased
    const [expandedSections, setExpandedSections] = useState<Record<Rarity, boolean>>({
        'Legendary': false,
        'Ultra Rare': false,
        'Rare': false,
        'Common': false
    });

    // Tab state for navigation
    const [activeTab, setActiveTab] = useState<'legendary' | 'ultra' | 'rare' | 'common'>('legendary');

    // NFT state for tracking purchases and API data
    const [nftList, setNftList] = useState<NFT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Categorized NFTs
    const [categorizedNFTs, setCategorizedNFTs] = useState<{
        legendary: NFT[];
        ultraRare: NFT[];
        rare: NFT[];
        common: NFT[];
    }>({
        legendary: [],
        ultraRare: [],
        rare: [],
        common: []
    });

    // Handle NFT purchase - open purchase modal
    const handleBuy = (nft: NFT) => {
        setPurchaseNFT(nft);
    };

    // Handle successful purchase
    const handlePurchaseSuccess = (purchaseData: any) => {
        console.log('Purchase successful:', purchaseData);

        // Update NFT status to sold
        setNftList(prevList =>
            prevList.map(item =>
                item.identifier === purchaseData.tokenId
                    ? { ...item, status: 'sold' as const }
                    : item
            )
        );

        // Close purchase modal
        setPurchaseNFT(null);
    };

    // Fetch NFTs from API
    const fetchNFTs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:3001/api/nfts');

            if (!response.ok) {
                throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                const nfts = result.data;
                setNftList(nfts);

                // Categorize NFTs based on name prefix
                const categorized = {
                    legendary: [] as NFT[],
                    ultraRare: [] as NFT[],
                    rare: [] as NFT[],
                    common: [] as NFT[]
                };

                nfts.forEach((nft: NFT) => {
                    const name = nft.name || '';

                    // Categorize based on name prefix
                    if (name.startsWith('MarsPioneer #L')) {
                        categorized.legendary.push({ ...nft, rarity: 'Legendary', status: nft.status || 'Available' });
                    } else if (name.startsWith('MarsPioneer #UR')) {
                        categorized.ultraRare.push({ ...nft, rarity: 'Ultra Rare', status: nft.status || 'Available' });
                    } else if (name.startsWith('MarsPioneer #R')) {
                        categorized.rare.push({ ...nft, rarity: 'Rare', status: nft.status || 'Available' });
                    } else if (name.startsWith('MarsPioneer #C')) {
                        categorized.common.push({ ...nft, rarity: 'Common', status: nft.status || 'Available' });
                    }
                });

                setCategorizedNFTs(categorized);
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (err) {
            console.error('Error fetching NFTs:', err);
            setError(err instanceof Error ? err.message : 'Failed to load NFTs');
        } finally {
            setLoading(false);
        }
    };

    // Fetch NFTs on component mount
    useEffect(() => {
        fetchNFTs();
    }, []);

    // Update categorized NFTs when nftList changes (for buy functionality)
    useEffect(() => {
        if (nftList.length > 0) {
            const categorized = {
                legendary: [] as NFT[],
                ultraRare: [] as NFT[],
                rare: [] as NFT[],
                common: [] as NFT[]
            };

            nftList.forEach((nft: NFT) => {
                const name = nft.name || '';

                if (name.startsWith('MarsPioneer #L')) {
                    categorized.legendary.push({ ...nft, rarity: 'Legendary' });
                } else if (name.startsWith('MarsPioneer #UR')) {
                    categorized.ultraRare.push({ ...nft, rarity: 'Ultra Rare' });
                } else if (name.startsWith('MarsPioneer #R')) {
                    categorized.rare.push({ ...nft, rarity: 'Rare' });
                } else if (name.startsWith('MarsPioneer #C')) {
                    categorized.common.push({ ...nft, rarity: 'Common' });
                }
            });

            setCategorizedNFTs(categorized);
        }
    }, [nftList]);

    // Helper to render a section
    const renderSection = (title: string, rarity: Rarity, items: NFT[]) => {
        const isExpanded = expandedSections[rarity];
        const displayedItems = isExpanded ? items : items.slice(0, 8);
        const hasMore = items.length > 8;

        return (
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className={`text-2xl font-bold uppercase tracking-wider ${rarity === 'Legendary' ? 'text-amber-400' :
                        rarity === 'Ultra Rare' ? 'text-violet-400' :
                            rarity === 'Rare' ? 'text-teal-400' :
                                'text-gray-400'
                        }`}>
                        {title}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    <span className="text-white/40 font-mono text-sm">{items.length} COLONISTS</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {displayedItems.map((nft) => (
                        <NFTCard
                            key={nft.identifier}
                            nft={nft}
                            onViewDetails={setSelectedNFT}
                            onBuy={handleBuy}
                        />
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setExpandedSections(prev => ({ ...prev, [rarity]: !prev[rarity] }))}
                            className="flex items-center gap-2 px-6 py-3 bg-[#1F1F1F] border border-[#FF4500]/30 rounded-full text-white font-semibold hover:bg-[#FF4500]/10 transition-all duration-300 group"
                        >
                            {isExpanded ? (
                                <>
                                    Show Less <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                                </>
                            ) : (
                                <>
                                    View More <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section id="nft-collection" className="relative py-24 bg-gradient-to-b from-[#0D0D0D] to-[#1F1F1F]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1F1F1F] border border-[#FF4500]/30 rounded-lg mb-6">
                        <Users className="w-3.5 h-3.5 text-[#FF4500]" />
                        <span className="text-xs text-white/80 font-medium tracking-wide">Exclusive NFT Collection</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        The First <span className="text-[#FF4500]">100 Colonists</span>
                    </h2>

                    <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                        Each NFT represents a unique colonist with specific roles, skills, and backstories. Own a piece of Mars history and gain exclusive community benefits.
                    </p>

                    {/* Rarity Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveTab('legendary')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'legendary'
                                ? 'bg-orange-500/30 text-amber-300 border border-orange-400/50'
                                : 'bg-orange-500/10 border border-orange-500/30 text-amber-400/80 hover:bg-orange-500/20 hover:border-orange-400/40'
                                }`}
                        >
                            LEGENDARY ({categorizedNFTs.legendary.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('ultra')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'ultra'
                                ? 'bg-violet-500/30 text-violet-300 border border-violet-400/50'
                                : 'bg-violet-500/10 border border-violet-500/30 text-violet-400/80 hover:bg-violet-500/20 hover:border-violet-400/40'
                                }`}
                        >
                            ULTRA RARE ({categorizedNFTs.ultraRare.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('rare')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'rare'
                                ? 'bg-teal-500/30 text-teal-300 border border-teal-400/50'
                                : 'bg-teal-500/10 border border-teal-500/30 text-teal-400/80 hover:bg-teal-500/20 hover:border-teal-400/40'
                                }`}
                        >
                            RARE ({categorizedNFTs.rare.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('common')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'common'
                                ? 'bg-neutral-600/40 text-gray-300 border border-neutral-500/50'
                                : 'bg-neutral-700/30 border border-neutral-600/30 text-gray-400/80 hover:bg-neutral-600/40 hover:border-neutral-500/40'
                                }`}
                        >
                            COMMON ({categorizedNFTs.common.length})
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4500]"></div>
                        <p className="text-white/60 mt-4">Loading NFTs...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                            <p className="text-red-400 font-semibold mb-2">Error Loading NFTs</p>
                            <p className="text-white/60 text-sm">{error}</p>
                            <button
                                onClick={fetchNFTs}
                                className="mt-4 px-6 py-2 bg-[#FF4500]/80 text-white rounded-lg hover:bg-[#FF4500]/90 transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Conditional Section Rendering */}
                {!loading && !error && (
                    <>
                        {activeTab === 'legendary' && renderSection('Legendary', 'Legendary', categorizedNFTs.legendary)}
                        {activeTab === 'ultra' && renderSection('Ultra Rare', 'Ultra Rare', categorizedNFTs.ultraRare)}
                        {activeTab === 'rare' && renderSection('Rare', 'Rare', categorizedNFTs.rare)}
                        {activeTab === 'common' && renderSection('Common', 'Common', categorizedNFTs.common)}
                    </>
                )}

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
                    <div className="text-center p-8 bg-[#1F1F1F] rounded-2xl border border-[#FF4500]/20">
                        <Award className="w-12 h-12 text-[#FF4500] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Exclusive Benefits</h3>
                        <p className="text-white/60">Access to exclusive NFT drops, early project features, and premium holder perks.</p>
                    </div>
                    <div className="text-center p-8 bg-[#1F1F1F] rounded-2xl border border-[#FF4500]/20">
                        <Zap className="w-12 h-12 text-[#FF4500] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Token Utility</h3>
                        <p className="text-white/60">Use the MarsPioneers Token for staking, rewards, governance, and future ecosystem utilities.</p>
                    </div>
                    <div className="text-center p-8 bg-[#1F1F1F] rounded-2xl border border-[#FF4500]/20">
                        <Users className="w-12 h-12 text-[#FF4500] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
                        <p className="text-white/60">Join the MarsPioneers community and help shape the future roadmap through voting and contributions.</p>
                    </div>
                </div>
            </div>

            {selectedNFT && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedNFT(null)}>
                    <div className="bg-[#1F1F1F] rounded-2xl max-w-2xl w-full p-8 relative border border-[#FF4500]/30" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNFT(null)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-4">{selectedNFT.name}</h2>
                        {selectedNFT.description && (
                            <p className="text-white/70 mb-6">{selectedNFT.description}</p>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between">
                                <span className="text-white/60">Rarity:</span>
                                <span className={`px-3 py-1 ${getRarityStyles(selectedNFT.rarity || 'Common')} text-xs font-bold rounded-full uppercase`}>
                                    {selectedNFT.rarity || 'Common'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Status:</span>
                                <span className="text-white font-semibold">{selectedNFT.status || 'Available'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Token ID:</span>
                                <span className="text-white font-semibold">#{selectedNFT.identifier}</span>
                            </div>
                        </div>

                        <button
                            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${selectedNFT.status === 'sold'
                                ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                                : 'bg-[#FF4500]/80 text-white hover:bg-[#FF4500]/90'
                                }`}
                            disabled={selectedNFT.status === 'sold'}
                            onClick={() => {
                                if (selectedNFT.status !== 'sold') {
                                    handleBuy(selectedNFT);
                                    setSelectedNFT(null);
                                }
                            }}
                        >
                            {selectedNFT.status === 'sold' ? 'Sold' : 'Buy This Colonist'}
                        </button>
                    </div>
                </div>
            )}

            {/* Purchase Modal */}
            {purchaseNFT && (
                <MultiChainPurchaseModal
                    nft={purchaseNFT}
                    onClose={() => setPurchaseNFT(null)}
                    onSuccess={handlePurchaseSuccess}
                />
            )}
        </section>
    );
}
