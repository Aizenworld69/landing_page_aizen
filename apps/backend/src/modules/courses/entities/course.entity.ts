export type CourseStatus = 'upcoming' | 'completed';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  status: CourseStatus;
  category: string;
  start_date: string | null;
  price: number;
  price_group: number;
  instructor_id: string;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  duration_minutes: number;
  order_index: number;
}

export interface CourseWithDetails extends Course {
  course_modules: CourseModule[];
  instructors: {
    id: string;
    name: string;
    title: string;
    avatar_url: string | null;
  } | null;
}
