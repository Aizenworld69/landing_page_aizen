import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import type { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepo: CoursesRepository) {}

  async findAll(query: QueryCourseDto) {
    const { data, total } = await this.coursesRepo.findAll(query);
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
    const course = await this.coursesRepo.findBySlug(slug);
    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found`);
    }
    return course;
  }
}
