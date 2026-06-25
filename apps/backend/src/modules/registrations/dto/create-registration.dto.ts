import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email khong hop le' })
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Chức vụ / Vị trí công việc' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  position?: string;

  @ApiProperty({ description: 'Nguồn biết đến chương trình' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng chọn nguồn biết đến chương trình' })
  referral: string;

  @ApiProperty({ enum: ['individual', 'group'], default: 'individual' })
  @IsEnum(['individual', 'group'])
  plan: 'individual' | 'group';
}
