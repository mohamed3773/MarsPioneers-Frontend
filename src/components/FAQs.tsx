import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQs() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is MarsPioneers 2040?",
            answer: "MarsPioneers 2040 is an NFT collection featuring the first 100 Genesis NFTs representing digital colonists on Mars. Each NFT is unique and comes with exclusive lore, community benefits, and future utilities."
        },
        {
            question: "How many NFTs are in the collection?",
            answer: "The Genesis collection consists of 100 unique NFTs. Future phases will expand the collection to 500 NFTs (Phase 3) and eventually 1,000 NFTs (Phase 4) as outlined in our roadmap."
        },
        {
            question: "What blockchain is used?",
            answer: "MarsPioneers NFTs are built on the Ethereum blockchain, ensuring security, transparency, and compatibility with major NFT marketplaces."
        },
        {
            question: "What are the benefits of holding a MarsPioneers NFT?",
            answer: "Holders gain access to exclusive lore chapters, community events, governance voting rights, MPTS token rewards, early access to future drops, and special Discord channels."
        },
        {
            question: "What is the MPTS token?",
            answer: "MPTS (MarsPioneers Token) is our utility token launching in Q2 2026. It will be used for staking rewards, marketplace transactions, governance, and accessing exclusive content."
        },
        {
            question: "How do I mint an NFT?",
            answer: "Connect your Web3 wallet (MetaMask, WalletConnect, etc.) to our platform, navigate to the NFT Collection section, select your desired NFT, and complete the minting process."
        },
        {
            question: "Can I sell or trade my NFT?",
            answer: "Yes! Once you own a MarsPioneers NFT, you can sell or trade it on our upcoming marketplace (Q1 2027) or on major NFT platforms like OpenSea."
        },
        {
            question: "What makes MarsPioneers unique?",
            answer: "We combine rich storytelling with Web3 technology. Each NFT is tied to an evolving lore narrative, community-driven decisions, and real utility through our token ecosystem and governance system."
        },
        {
            question: "How do I join the community?",
            answer: "Join our Discord server to connect with other pioneers, participate in events, access exclusive content, and stay updated on project developments."
        },
        {
            question: "What is the roadmap for the project?",
            answer: "Our roadmap includes: Genesis Launch (Current), MPTS Token Launch (Q2 2026), NFT Expansion to 500 (Q3 2026), and Marketplace Launch with full 1,000 collection (Q1 2027)."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-black pt-32 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-[#FF4500] hover:text-[#FF4500]/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF1E56] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-white/70 text-lg">
                        Everything you need to know about MarsPioneers 2040
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-2xl border border-[#FF4500]/30 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FF4500]/5 transition-colors"
                            >
                                <span className="text-white font-semibold text-lg pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#FF4500] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-5 pt-2">
                                    <p className="text-white/70 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact section */}
                <div className="mt-12 text-center">
                    <p className="text-white/60 mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="mailto:contact@marspioneers.tech"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-semibold rounded-lg hover:shadow-md hover:shadow-[#FF4500]/15 transition-all duration-300"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
