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

  @ApiProperty({ enum: ['individual', 'group'], default: 'individual' })
  @IsEnum(['individual', 'group'])
  plan: 'individual' | 'group';
}
