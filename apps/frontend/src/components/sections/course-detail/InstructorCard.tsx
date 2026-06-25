import Image from 'next/image';
import type { Instructor } from '@aizen/types';

interface InstructorCardProps {
  instructor: Pick<Instructor, 'id' | 'name' | 'title' | 'avatar_url' | 'bio'>;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <section className="mb-10">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center justify-center gap-2">
        <span className="text-sky-400">🎙</span> DIỄN GIẢ CHƯƠNG TRÌNH
      </p>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {instructor.avatar_url ? (
              <Image
                src={instructor.avatar_url}
                alt={instructor.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-500/30 shadow-lg shadow-sky-500/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <span className="text-white text-3xl font-bold">{instructor.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{instructor.name}</h3>
            <p className="text-sky-400 font-semibold text-sm mb-1">{instructor.title}</p>
            <div className="w-8 h-0.5 bg-sky-500 mb-4 mx-auto sm:mx-0" />

            {instructor.bio && (
              <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-lg">{instructor.bio}</p>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <button
                aria-label="Chia sẻ"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
