import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('PromoCodes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  // ─── Public ───────────────────────────────────────────────────────
  /** Khách hàng gọi để xem trước mức giảm giá, KHÔNG tốn lượt dùng */
  @Post('validate')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kiểm tra mã khuyến mãi (public, không tốn lượt)' })
  validate(@Body() dto: ValidatePromoCodeDto) {
    return this.promoCodesService.validate(dto.code, dto.course_id, dto.plan);
  }

  // ─── Admin ────────────────────────────────────────────────────────
  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Danh sách mã khuyến mãi' })
  @ApiQuery({ name: 'page',      required: false, type: Number })
  @ApiQuery({ name: 'limit',     required: false, type: Number })
  @ApiQuery({ name: 'course_id', required: false, type: String })
  adminFindAll(
    @Query('page')      page      = '1',
    @Query('limit')     limit     = '20',
    @Query('course_id') course_id?: string,
  ) {
    return this.promoCodesService.adminFindAll({
      page:  Number(page),
      limit: Number(limit),
      course_id,
    });
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Tạo mã khuyến mãi mới' })
  adminCreate(@Body() dto: CreatePromoCodeDto) {
    return this.promoCodesService.adminCreate(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật mã khuyến mãi' })
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePromoCodeDto,
  ) {
    return this.promoCodesService.adminUpdate(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Xóa mã khuyến mãi' })
  adminDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.promoCodesService.adminDelete(id);
  }
}
