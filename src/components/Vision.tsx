import { Target, Rocket, Globe, Zap } from 'lucide-react';

export default function Vision() {
  const roadmap = [
    {
      phase: 'Phase 1',
      title: 'Genesis Launch',
      status: 'Current',
      isCompleted: true,
      items: ['Launch the first 100 Genesis NFTs', 'Establish Discord & community channels', 'Release initial lore chapters', 'Host AMA sessions for early adopters'],
    },
    {
      phase: 'Phase 2',
      title: 'MPTS Token Launch',
      status: 'Q2 2026',
      items: ['Launch the official MPTS token', 'Publish tokenomics, utilities & whitepaper', 'Deploy smart contract on mainnet', 'Introduce staking & reward systems', 'Add exclusive MPTS holder roles'],
    },
    {
      phase: 'Phase 3',
      title: 'NFT Expansion',
      status: 'Q3 2026',
      items: ['Release 400 new NFTs (total supply becomes 500)', 'Introduce new Genome categories & mutations', 'Upgrade the rarity system', 'Host official reveal event', 'Integrate MPTS utilities with new NFTs'],
    },
    {
      phase: 'Phase 4',
      title: 'Marketplace Launch & Full Collection',
      status: 'Q1 2027',
      items: ['Launch the official NFT Marketplace', 'Enable buying, selling & bidding', 'Integrate MPTS as a payment & fee token', 'Release the remaining 500 NFTs (total 1000)', 'Add rarity filters & collector tools', 'Publish final lore for the complete collection'],
    },
  ];

  const teamValues = [
    {
      icon: Target,
      title: 'Lore-Driven Mission',
      description: 'Rebuilding the ancient Martian legacy through storytelling, discovery, and community-driven exploration.',
    },
    {
      icon: Rocket,
      title: 'Genesis Innovation',
      description: 'Using Web3 technology to bring the Martian Genomes to life through evolving chapters, rarity-based abilities, and hidden lore unlocks.',
    },
    {
      icon: Globe,
      title: 'The Martian Sanctuary',
      description: 'Creating access points for every user to participate in restoring the lost Sanctuary and uncovering encrypted Martian knowledge.',
    },
    {
      icon: Zap,
      title: 'Community Activation',
      description: 'Empowering holders to shape the story\'s direction, participate in key decisions, and influence the future of the Genomes.',
    },
  ];

  return (
    <section id="vision" className="relative py-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] border border-[#FF4500]/30 rounded-full mb-6">
            <Rocket className="w-4 h-4 text-[#FF4500]" />
            <span className="text-sm text-white/80 font-medium">Our Mission</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Vision & <span className="text-[#FF4500]">Genesis Roadmap</span>
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We're not just creating NFTs—we're rebuilding the forgotten legacy of Mars. Together, we will guide the 100 Genomes, uncover ancient truths, and restore the final echoes of a lost civilization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {teamValues.map((value) => (
            <div
              key={value.title}
              className="bg-[#1F1F1F] rounded-xl p-6 border border-[#FF4500]/20 hover:border-[#FF4500]/50 transition-all duration-300"
            >
              <value.icon className="w-10 h-10 text-[#FF4500] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Project Roadmap</h3>
          <div className="grid lg:grid-cols-4 gap-8">
            {roadmap.map((phase, index) => (
              <div key={phase.phase} className="relative">
                {index < roadmap.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#FF4500]/60 to-transparent"></div>
                )}
                <div className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-3xl p-8 border border-[#FF4500]/30 h-full shadow-xl shadow-black/30">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[#FF4500] font-bold text-sm">{phase.phase}</span>
                    <span className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white/60">
                      {phase.status}
                    </span>
                  </div>
                  <h4 className="text-2xl font-extrabold text-white mb-6 leading-tight">
                    {phase.title}
                  </h4>
                  <ul className="space-y-4">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
                        {phase.isCompleted ? (
                          <span className="text-[#FF4500] mt-0.5 flex-shrink-0 font-semibold">✔</span>
                        ) : (
                          <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FF4500]/10 via-[#1F1F1F] to-[#0D0D0D] rounded-3xl p-14 border border-[#FF4500]/30 text-center">
          <h3 className="text-[2.75rem] font-bold text-white mb-7 leading-tight">
            Be Part of History
          </h3>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            This is your invitation to join a community that believes in pushing humanity forward. Together, we're not just imagining the future—we're building it.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <a
              href="#nft-collection"
              className="px-8 py-4 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-bold rounded-lg hover:shadow-md hover:shadow-[#FF4500]/15 transition-all duration-300 transform hover:scale-105"
            >
              Mint Your NFT
            </a>
            <a
              href="#community"
              className="px-8 py-4 bg-[#1F1F1F] border-2 border-[#FF4500] text-white font-bold rounded-lg hover:bg-[#FF4500]/10 hover:shadow-md hover:shadow-[#FF4500]/15 transition-all duration-300"
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
