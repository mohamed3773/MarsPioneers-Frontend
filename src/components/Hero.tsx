import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
        >
            <div className="absolute inset-0 bg-[url('/mars-bg.jpg')] bg-cover bg-center opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0A0A0A]/80 to-black/95 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-[url('/mars-bg.jpg')] bg-cover bg-center opacity-50"></div>

            {/* === Main Content === */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/40 border border-[#FF4B1F]/40 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-black/20 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-[#FF4B1F]" />
                    <span className="text-sm text-white/80 font-medium">First Mars Colony 2040</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 animate-slide-up">
                    <span className="text-white">Become a</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B1F] to-[#FF6A3D]">
                        Mars Pioneers
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in delay-200">
                    Join the first 100 digital colonists in humanity's boldest mission. Own your piece of Mars history through exclusive NFTs and shape the future of interplanetary civilization.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
                    <a
                        href="#nft-collection"
                        className="group px-8 py-4 bg-gradient-to-r from-[#FF4B1F] to-[#FF6A3D] text-white font-bold rounded-xl 
            shadow-md shadow-black/20 hover:shadow-black/30 transition-all duration-300 transform hover:scale-[1.03] flex items-center gap-2"
                    >
                        Mint Your NFT
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href="https://opensea.io/0x0a9037401fd7fa6c0937c89a5d504ddb684c4be8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-black/40 border-2 border-[#FF4B1F]/50 text-white font-bold rounded-xl hover:bg-[#FF4B1F]/10 transition-all duration-300"
                    >
                        View on OpenSea
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-3 gap-10 max-w-3xl mx-auto animate-fade-in delay-500">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-extrabold text-[#FF4B1F] mb-1">100</div>
                        <div className="text-sm text-white/60 tracking-wider uppercase">First Colonists</div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-extrabold text-[#FF4B1F] mb-1">2040</div>
                        <div className="text-sm text-white/60 tracking-wider uppercase">Mission Year</div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-extrabold text-[#FF4B1F] mb-1">1</div>
                        <div className="text-sm text-white/60 tracking-wider uppercase">New World</div>
                    </div>
                </div>

            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0D0D0D]"></div>

            {/* === Simple Animations (Tailwind) === */}
            <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.4s forwards;
        }
        .animate-slide-up {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 1.2s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

        </section>
    );
}
