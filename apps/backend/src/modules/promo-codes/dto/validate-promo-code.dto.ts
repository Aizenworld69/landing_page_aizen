import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePromoCodeDto {
  @ApiProperty({ description: 'Mã khuyến mãi khách nhập', example: 'AIZEN50' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  code: string;

  @ApiProperty({ description: 'UUID khóa học đang đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ enum: ['individual', 'group'] })
  @IsEnum(['individual', 'group'])
  plan: 'individual' | 'group';
}
