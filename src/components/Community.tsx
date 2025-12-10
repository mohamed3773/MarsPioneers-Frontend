import { MessageCircle, Trophy, Calendar, Users } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Community() {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const signalsHeaderRef = useRef<HTMLHeadingElement>(null);

  const handleBackClick = () => {
    setShowAllEvents(false);
    // Scroll to the Incoming Signals header
    signalsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const benefits = [
    {
      icon: MessageCircle,
      title: 'The Martian Vault',
      description: 'Access hidden lore, encrypted messages, and ancient records left behind by the last Martian civilization.',
    },
    {
      icon: Trophy,
      title: 'Genome Rewards',
      description: 'Earn exclusive digital rewards, token bonuses, and rare content for contributing to the evolution of the Martian storyline.',
    },
    {
      icon: Calendar,
      title: 'Lore Sessions',
      description: 'Join live chapter reveals, community discussions, and guided journeys into the deeper mysteries of the Martian Genomes.',
    },
    {
      icon: Users,
      title: 'Council Decisions',
      description: 'Vote on key story outcomes, future utilities, and major choices that shape the destiny of the 100 Genomes.',
    },
  ];

  const upcomingEvents = [
    { date: 'Dec 10', title: 'MarsPioneers AMA Session', time: '7:00 PM UTC' },
    { date: 'Dec 17', title: 'Genesis 100 NFT Release', time: '6:00 PM UTC' },
    { date: 'Dec 22', title: 'Expansion Roadmap Reveal', time: '8:00 PM UTC' },
  ];

  const additionalEvents = [
    { date: 'Jan 5', title: 'Token Preview Session', time: '7:00 PM UTC' },
    { date: 'Jan 12', title: 'Chapter 2 Live Reading', time: '6:00 PM UTC' },
    { date: 'Jan 19', title: 'Wave 2 Sneak Peek', time: '8:00 PM UTC' },
    { date: 'Jan 26', title: 'Community Strategy Meeting', time: '7:00 PM UTC' },
  ];

  return (
    <section id="community" className="relative py-20 sm:py-24 bg-gradient-to-b from-[#1F1F1F] to-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] border border-[#FF4500]/30 rounded-full mb-6">
            <Users className="w-4 h-4 text-[#FF4500]" />
            <span className="text-sm text-white/80 font-medium">Join the Colony</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Genome Command <span className="text-[#FF4500]">Center</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto px-4">
            Unite with other pioneers to unlock hidden knowledge, influence the fate of the 100 Genomes, and take part in restoring the lost legacy of Mars.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6 mb-12 sm:mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group bg-[#1F1F1F] rounded-2xl p-6 sm:p-7 border border-[#FF4500]/20 hover:border-[#FF4500]/60 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-lg shadow-black/20 hover:shadow-[#FF4500]/10"
            >
              <div className="mb-5">
                <benefit.icon className="w-11 h-11 text-[#FF4500]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-2xl p-6 sm:p-8 border border-[#FF4500]/30 shadow-lg shadow-black/20">
            <h3 ref={signalsHeaderRef} className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#FF4500]" />
              Incoming Signals
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.title}
                  className="flex items-center justify-between p-4 bg-[#0D0D0D]/50 rounded-xl border border-[#FF4500]/10 hover:border-[#FF4500]/30 transition-all duration-300"
                >
                  <div>
                    <div className="font-bold text-white mb-1 text-sm sm:text-base">{event.title}</div>
                    <div className="text-xs sm:text-sm text-white/60">{event.time}</div>
                  </div>
                  <div className="text-[#FF4500] font-bold text-lg sm:text-xl">{event.date}</div>
                </div>
              ))}
            </div>

            {showAllEvents && (
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                {additionalEvents.map((event) => (
                  <div
                    key={event.title}
                    className="flex items-center justify-between p-4 bg-[#0D0D0D]/50 rounded-xl border border-[#FF4500]/10 hover:border-[#FF4500]/30 transition-all duration-300"
                  >
                    <div>
                      <div className="font-bold text-white mb-1 text-sm sm:text-base">{event.title}</div>
                      <div className="text-xs sm:text-sm text-white/60">{event.time}</div>
                    </div>
                    <div className="text-[#FF4500] font-bold text-lg sm:text-xl">{event.date}</div>
                  </div>
                ))}
              </div>
            )}

            {!showAllEvents ? (
              <button
                onClick={() => setShowAllEvents(true)}
                className="w-full mt-6 px-6 py-3 bg-[#FF4500]/10 border border-[#FF4500] text-[#FF4500] font-semibold rounded-lg hover:bg-[#FF4500]/20 transition-all duration-300"
              >
                View All Signals
              </button>
            ) : (
              <button
                onClick={handleBackClick}
                className="flex items-center text-[#FF4500] hover:text-[#FF4500]/80 transition-colors mt-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#FF4500]/10 to-transparent rounded-2xl p-6 sm:p-8 border border-[#FF4500]/30 flex flex-col justify-between shadow-lg shadow-black/20">
            <div>
              <MessageCircle className="w-11 h-11 sm:w-12 sm:h-12 text-[#FF4500] mb-6" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Join the Martian Network
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed text-sm sm:text-base">
                Connect with other pioneers restoring the lost Martian legacy. Share discoveries, decode messages, and influence the fate of the 100 Genomes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-full"></div>
                  24/7 Active Martian Community
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-full"></div>
                  Exclusive Channels for Genome Holders
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-full"></div>
                  Early Access to Hidden Lore
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-[#FF4500] rounded-full"></div>
                  Team &amp; Project Announcements
                </li>
              </ul>
            </div>
            <a href="https://discord.gg/2buCuUVC" target="_blank" rel="noopener noreferrer" className="block w-full px-8 py-4 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FF4500]/20 transition-all duration-300 transform hover:scale-[1.02] text-center">
              Join the Martian Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
