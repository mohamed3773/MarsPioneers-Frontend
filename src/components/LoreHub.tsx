import { useState } from 'react';
import { BookOpen, MapPin, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';

export default function LoreHub() {
  const loreChapters = [
    {
      id: 1,
      title: 'The Last Breath of Mars',
      date: '2040-01-15',
      location: 'Mars Vault',
      excerpt: 'As Mars takes its final breath, Aelius—the last pure Martian—watches his world collapse. In a desperate attempt to preserve their ancient lineage, the elders create 100 genetic copies of him, carrying the last hope of a dying civilization.',
    },
    {
      id: 2,
      title: 'Echoes in the Void',
      date: '2040-02-03',
      location: 'Deep Space',
      excerpt: 'Drifting through the silent darkness, the 100 capsules awaken one by one. A faint signal pulsing from the void calls to them—a message encoded long before Mars fell. Aelius\'s legacy has found its first response.',
    },
    {
      id: 3,
      title: 'The Beacon\'s Secret',
      date: '2040-02-28',
      location: 'Outer Rim',
      excerpt: 'As the 100 genomes approach the source of the mysterious signal, a forgotten structure emerges from the darkness—ancient, colossal, and unmistakably Martian. Their true purpose is about to be revealed.',
    },
  ];

  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleBackClick = (chapterId: number) => {
    // Collapse the expanded chapter
    setExpandedChapter(null);

    // Scroll to the specific chapter section
    setTimeout(() => {
      const chapterElement = document.getElementById(`chapter-${chapterId}`);
      if (chapterElement) {
        chapterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const getFullChapterContent = (chapterId: number) => {
    if (chapterId === 1) {
      return (
        <div className="mt-8 pt-8 border-t border-[#FF4500]/20 space-y-6 text-white/80 leading-relaxed">
          <p className="text-xl font-semibold text-white">Mars was dying.</p>

          <p>
            The red soil had begun to crack, and the winds howled as if mourning the end of a civilization that had lasted thousands of years.
            Amid the destruction, one final tribe struggled to survive…
            A lineage of ancient Martian sages, led by the last pure descendant of their kind: Aelius.
          </p>

          <p>
            Aelius was small, with gentle features and large, cosmic eyes that reflected innocence…
            But behind that calm, childlike face, he carried the greatest secret of all:
            the original Martian Genome.
          </p>

          <p>
            When the elders realized the end was near, they gathered every ounce of their remaining strength—every fragment of knowledge, every memory of their people—
            and poured it into one final, impossible project:
          </p>

          <p className="text-xl font-semibold text-white">the creation of 100 genetic copies of Aelius.</p>

          <p>
            These copies were not simple clones.
            They were their last attempt to save an entire species from extinction.
          </p>

          <p className="text-xl font-semibold text-white">But time was merciless.</p>

          <p>
            On the night the hundred copies were completed, a massive quake shook the Martian vault.
            Walls crumbled, lights dimmed, and the air began to thin.
          </p>

          <p>
            Aelius ran toward the incubation chambers holding the 100 genomes…
            There were only minutes left before Mars would breathe its last.
          </p>

          <p>
            He placed his small hand on the activation panel.
            The chambers glowed with radiant light, and a soft countdown echoed through the collapsing hall:
          </p>

          <p className="text-center text-2xl font-bold text-[#FF4500]">3… 2… 1…</p>

          <p>
            And in the moment the ceiling broke above him…
            the 100 capsules launched into the stars—each carrying a spark of life, a seed of hope.
          </p>

          <p>
            Aelius closed his eyes and smiled faintly.
            Even if his world was ending, he had sent the future into the cosmos.
          </p>

          <p className="text-xl font-semibold text-white">The Martian race vanished that day.</p>

          <p>
            But hope remained—
            in 100 tiny souls, each holding the essence of an ancient world.
          </p>

          <p className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] to-[#FF6A3D] mt-8">
            These were the…
            Last Martian Genomes.
          </p>

          <button
            onClick={() => handleBackClick(1)}
            className="mt-8 flex items-center gap-2 text-[#FF4500] hover:text-[#FF6A3D] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      );
    }

    if (chapterId === 2) {
      return (
        <div className="mt-8 pt-8 border-t border-[#FF4500]/20 space-y-6 text-white/80 leading-relaxed">
          <p className="text-xl font-semibold text-white">The universe was silent.</p>

          <p>
            The 100 capsules that launched from the dying surface of Mars drifted through the darkness like tiny stars, each carrying the fragile spark of a lost world.
            Inside them, the newly formed genomes began to stir—weak, confused, but alive.
          </p>

          <p>
            For days, they floated through the void with no direction…
            No home…
            No guardian to guide them.
          </p>

          <p className="text-xl font-semibold text-white">But then—something impossible happened.</p>

          <p>
            A soft vibration echoed through the emptiness, like a whisper breaking the eternal silence.
            The capsules detected a signal, faint but unmistakable.
            Not from Earth.
            Not from any known star.
          </p>

          <p>
            It was a message…
            encoded in the ancient Martian language.
          </p>

          <p>
            Inside Capsule 07, the young genome Eon opened his eyes for the first time.
            His vision was blurry, his mind still forming, but the signal resonated deep within him—as if calling him by name.
          </p>

          <p className="text-center text-lg italic text-[#FF4500]">"…to the children of Aelius… follow the light…"</p>

          <p>The message repeated in steady pulses.</p>

          <p>
            Eon felt something awaken—
            a memory that was not his own,
            a sorrow he had never lived,
            and a duty he did not understand.
          </p>

          <p>
            The capsules aligned, adjusting course toward the distant beacon hidden within the signal.
            One by one, they formed a glowing trail through the void.
          </p>

          <p>
            Somewhere out there…
            someone had been waiting.
          </p>

          <p>And as the silence of Deep Space held them close, the 100 genomes felt it—</p>

          <p className="text-xl font-semibold text-white">
            Aelius had not sent them into nothingness.
            He had sent them toward destiny.
          </p>

          <button
            onClick={() => handleBackClick(2)}
            className="mt-8 flex items-center gap-2 text-[#FF4500] hover:text-[#FF6A3D] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      );
    }

    if (chapterId === 3) {
      return (
        <div className="mt-8 pt-8 border-t border-[#FF4500]/20 space-y-6 text-white/80 leading-relaxed">
          <p>The journey through the void felt endless.
            But at the edge of a distant star system—where light faded and shadows ruled—the capsules finally slowed.</p>

          <p className="text-xl font-semibold text-white">The signal grew stronger.</p>

          <p>
            The hum that once sounded like a whisper had become a steady, pulsing rhythm, echoing inside every genome like a heartbeat.
          </p>

          <p>
            And then…
            it appeared.
          </p>

          <p>
            A colossal structure drifted out of the darkness.
            Ancient.
            Silent.
            Martian.
          </p>

          <p>
            Its surface was covered in symbols—markings older than any recorded Martian history.
            The 100 capsules formed a perfect orbit around the construct, drawn by an unseen force.
          </p>

          <p>
            Inside Capsule 12, the genome Lyra gazed in awe.
            She felt the same warmth Eon had sensed—
            a feeling like a distant memory returning home.
          </p>

          <p className="text-xl font-semibold text-white">The structure activated.</p>

          <p>
            Lines of crimson light crawled across its surface.
            The void trembled.
            The capsules vibrated.
          </p>

          <p>Then a voice—ancient, gentle, and impossibly familiar—filled the darkness:</p>

          <p className="text-center text-lg italic text-[#FF4500]">
            "Children of Aelius…
            you have arrived."
          </p>

          <p>The voice continued:</p>

          <p className="text-center text-lg italic text-[#FF4500]">
            "Our world fell long before yours.
            We built this Beacon to guide those who would carry our legacy…
            to finish what we could not."
          </p>

          <p>
            Images flashed across every capsule—
            visions of the ancient Martian empire, its downfall, the creation of the first pure genome, and the prophecy of their return.
          </p>

          <p>
            This Beacon was not just a signal.
            A warning.
            A final gift.
          </p>

          <p>The voice whispered:</p>

          <p className="text-center text-lg italic text-[#FF4500]">
            "You are the last heirs of Mars.
            Find the Sanctuary.
            Rebuild the flame."
          </p>

          <p className="text-xl font-semibold text-white">Silence returned.</p>

          <p>But now the 100 genomes knew the truth:</p>

          <p>
            They were chosen.
            Guided.
            Expected.
          </p>

          <p>
            For the first time since leaving Mars, the void felt less like a grave—
            and more like a beginning.
          </p>

          <button
            onClick={() => handleBackClick(3)}
            className="mt-8 flex items-center gap-2 text-[#FF4500] hover:text-[#FF6A3D] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="lore" className="relative py-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] border border-[#FF4500]/30 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-[#FF4500]" />
            <span className="text-sm text-white/80 font-medium">Interactive Storytelling</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The <span className="text-[#FF4500]">Mars Chronicles</span>
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Dive deep into the rich narrative of humanity's first Mars colony. Every NFT holder contributes to the evolving story of the MarsPioneers universe.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto mb-16">
          {loreChapters.map((chapter, index) => (
            <div
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              className="group relative bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-2xl p-8 border border-[#FF4500]/20 hover:border-[#FF4500] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 text-[120px] font-bold text-white/5 leading-none pr-8">
                {index + 1}
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#FF4500] text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{chapter.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FF4500] text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{chapter.location}</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#FF4500] transition-colors">
                  {chapter.title}
                </h3>

                <p className="text-white/70 leading-relaxed mb-6">
                  {chapter.excerpt}
                </p>

                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex items-center gap-2 text-[#FF4500] font-semibold group-hover:gap-4 transition-all"
                >
                  Read Full Chapter
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Expanded Chapter Content */}
                {expandedChapter === chapter.id && getFullChapterContent(chapter.id)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] rounded-2xl p-12 border border-[#FF4500]/30 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Become a Keeper of the Genome
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Every NFT holder gains privileged access to shape the rebirth of the Martian legacy.
            Unlock hidden chapters, influence the fate of the 100 genomes, and discover secrets buried within the ancient Martian Vault.
          </p>
          <a
            href="https://t.me/+BXd-ysJ1D8E0ODQy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF4500] to-[#FF1E56] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FF4500]/10 transition-all duration-300 transform hover:scale-105"
          >
            Enter the Genesis Chamber
          </a>
        </div>
      </div>
    </section>
  );
}
