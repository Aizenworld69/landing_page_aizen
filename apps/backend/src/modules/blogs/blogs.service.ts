import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import type { QueryBlogDto } from './dto/query-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepo: BlogsRepository) {}

  async findAll(query: QueryBlogDto) {
    const { data, total } = await this.blogsRepo.findAll(query);
    const { page = 1, limit = 9 } = query;

    return {
      items: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const blog = await this.blogsRepo.findBySlug(slug);
    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }

    const related = await this.blogsRepo.findRelated(slug, blog.category);

    return { ...blog, related };
  }
}
