import { Controller, Get, Param, ParseUUIDPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InstructorsService } from './instructors.service';
import { QueryInstructorDto } from './dto/query-instructor.dto';
import { ResponseTransformInterceptor } from '../../common/interceptors/response-transform.interceptor';

@ApiTags('Instructors')
@Controller('instructors')
@UseInterceptors(ResponseTransformInterceptor)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get()
  @ApiOperation({ summary: 'Lay danh sach giang vien' })
  findAll(@Query() query: QueryInstructorDto) {
    return this.instructorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lay chi tiet giang vien' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructorsService.findOne(id);
  }
}
