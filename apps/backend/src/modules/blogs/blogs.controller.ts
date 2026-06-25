import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { QueryBlogDto } from './dto/query-blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({ summary: 'Lay danh sach bai viet blog' })
  findAll(@Query() query: QueryBlogDto) {
    return this.blogsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lay chi tiet bai viet blog theo slug' })
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }
}
