import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import type { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async create(dto: CreateRegistrationDto) {
    // Verify course exists and is upcoming
    const { data: course, error: courseError } = await this.supabase
      .from('courses')
      .select('id, title, status')
      .eq('id', dto.courseId)
      .single();

    if (courseError || !course) {
      throw new NotFoundException('Course not found');
    }

    if (course['status'] !== 'upcoming') {
      throw new BadRequestException('This course is not accepting registrations');
    }

    // Check duplicate registration (same email + course)
    const { data: existing } = await this.supabase
      .from('registrations')
      .select('id')
      .eq('course_id', dto.courseId)
      .eq('email', dto.email)
      .maybeSingle();

    if (existing) {
      throw new BadRequestException('You have already registered for this course');
    }

    const { data, error } = await this.supabase
      .from('registrations')
      .insert({
        course_id: dto.courseId,
        full_name: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        company: dto.company ?? null,
        plan: dto.plan,
      })
      .select('id, created_at')
      .single();

    if (error) {
      this.logger.error('Create registration failed', error);
      throw new BadRequestException('Registration failed, please try again');
    }

    return {
      id: data['id'],
      message: 'Dang ky thanh cong! Chung toi se lien he voi ban som nhat.',
      createdAt: data['created_at'],
    };
  }
}
