import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({ enum: ['upcoming', 'completed'] })
  @IsEnum(['upcoming', 'completed'])
  status: 'upcoming' | 'completed';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_group: number;

  @ApiProperty()
  @IsUUID()
  instructor_id: string;
}
