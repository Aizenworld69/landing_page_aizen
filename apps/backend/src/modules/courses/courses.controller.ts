import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { QueryCourseDto } from './dto/query-course.dto';
import { ResponseTransformInterceptor } from '../../common/interceptors/response-transform.interceptor';

@ApiTags('Courses')
@Controller('courses')
@UseInterceptors(ResponseTransformInterceptor)
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
