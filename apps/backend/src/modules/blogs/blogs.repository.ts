import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import type { QueryBlogDto } from './dto/query-blog.dto';
import type { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsRepository {
  private readonly logger = new Logger(BlogsRepository.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findAll(query: QueryBlogDto): Promise<{ data: Blog[]; total: number }> {
    const { category, page = 1, limit = 9 } = query;
    const offset = (page - 1) * limit;

    let builder = this.supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) builder = builder.eq('category', category);

    const { data, error, count } = await builder;

    if (error) {
      this.logger.error('findAll blogs failed', error);
      throw error;
    }

    return { data: data ?? [], total: count ?? 0 };
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await this.supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      this.logger.error('findBySlug failed', error);
      throw error;
    }

    return data as Blog;
  }

  async findRelated(slug: string, category: string, limitCount = 5): Promise<Blog[]> {
    const { data, error } = await this.supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(limitCount);

    if (error) {
      this.logger.error('findRelated failed', error);
      throw error;
    }

    return data ?? [];
  }
}
