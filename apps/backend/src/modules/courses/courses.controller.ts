import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { QueryCourseDto } from './dto/query-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Lay danh sach khoa hoc' })
  findAll(@Query() query: QueryCourseDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lay chi tiet khoa hoc theo slug' })
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }
}