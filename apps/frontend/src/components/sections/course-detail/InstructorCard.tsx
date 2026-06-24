import Image from 'next/image';
import type { Instructor } from '@aizen/types';

interface InstructorCardProps {
  instructor: Pick<Instructor, 'id' | 'name' | 'title' | 'avatar_url' | 'bio'>;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <section className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Giảng viên</h2>
      <div className="flex items-start gap-4">
        {instructor.avatar_url ? (
          <Image
            src={instructor.avatar_url}
            alt={instructor.name}
            width={64}
            height={64}
            className="rounded-full object-cover flex-shrink-0 border-2 border-white shadow"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👤</span>
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900">{instructor.name}</p>
          <p className="text-sm text-primary-500 font-medium mt-0.5">{instructor.title}</p>
          {instructor.bio && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-4">
              {instructor.bio}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
