import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import type { QueryCourseDto } from './dto/query-course.dto';
import type { CreateCourseDto } from './dto/create-course.dto';
import type { UpdateCourseDto } from './dto/update-course.dto';
import type { Course, CourseWithDetails } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  private readonly logger = new Logger(CoursesRepository.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findAll(query: QueryCourseDto): Promise<{ data: Course[]; total: number }> {
    const { status, category, year, page = 1, limit = 9 } = query;
    const offset = (page - 1) * limit;

    let builder = this.supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (status) builder = builder.eq('status', status);
    if (category) builder = builder.eq('category', category);
    if (year) builder = builder.like('start_date', `${year}%`);

    const { data, error, count } = await builder;

    if (error) {
      this.logger.error('findAll courses failed', error);
      throw error;
    }

    return { data: data ?? [], total: count ?? 0 };
  }

  async findBySlug(slug: string): Promise<CourseWithDetails | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        course_modules (
          id,
          title,
          subtitle,
          description,
          duration_minutes,
          order_index,
          start_time,
          item_type
        ),
        instructors (id, name, title, avatar_url, bio)
      `)
      .eq('slug', slug)
      .order('order_index', { referencedTable: 'course_modules', ascending: true })
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      this.logger.error('findBySlug failed', error);
      throw error;
    }

    return data as CourseWithDetails;
  }

  async findById(id: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .insert([dto])
      .select()
      .single();

    if (error) {
      this.logger.error('create course failed', error);
      throw error;
    }

    return data as Course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`update course ${id} failed`, error);
      throw error;
    }

    return data as Course;
  }

  async delete(id: string): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`delete course ${id} failed`, error);
      throw error;
    }

    return data as Course;
  }
}
