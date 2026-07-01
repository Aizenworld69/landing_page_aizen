import {
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromoCodeDto {
  @ApiProperty({ description: 'Mã do admin tự đặt, VD: AIZEN50', example: 'AIZEN50' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_-]+$/, { message: 'Mã chỉ gồm chữ hoa, số, gạch dưới, gạch ngang' })
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  code: string;

  @ApiProperty({ description: 'UUID của khóa học áp dụng' })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ enum: ['individual', 'group', 'all'], default: 'all' })
  @IsIn(['individual', 'group', 'all'])
  plan: 'individual' | 'group' | 'all';

  @ApiProperty({ enum: ['percent', 'fixed'], description: 'percent = % giảm, fixed = giảm cố định (VND)' })
  @IsIn(['percent', 'fixed'])
  discount_type: 'percent' | 'fixed';

  @ApiProperty({ description: 'Giá trị giảm (% hoặc VND)', example: 50 })
  @IsNumber()
  @IsPositive()
  discount_value: number;

  @ApiProperty({ description: 'Giới hạn số lượt sử dụng', example: 100 })
  @IsNumber()
  @Min(1)
  max_uses: number;

  @ApiPropertyOptional({ description: 'Ngày hết hạn (ISO 8601), bỏ trống = không hết hạn' })
  @IsOptional()
  @IsISO8601()
  expires_at?: string;

  @ApiPropertyOptional({ description: 'Ghi chú nội bộ cho marketing' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
