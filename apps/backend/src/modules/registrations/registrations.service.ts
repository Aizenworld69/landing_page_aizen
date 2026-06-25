import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import type { CreateRegistrationDto } from './dto/create-registration.dto';
import type { CreateGroupRegistrationDto } from './dto/create-group-registration.dto';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    private readonly config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────
  // Đăng ký cá nhân (1 người)
  // ─────────────────────────────────────────────
  async create(dto: CreateRegistrationDto) {
    const course = await this.verifyCourse(dto.courseId);

    // Check duplicate
    const { data: existing } = await this.supabase
      .from('registrations')
      .select('id')
      .eq('course_id', dto.courseId)
      .eq('email', dto.email)
      .maybeSingle();

    if (existing) {
      throw new BadRequestException('Email này đã đăng ký khóa học này rồi');
    }

    const { data, error } = await this.supabase
      .from('registrations')
      .insert({
        course_id: dto.courseId,
        full_name: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        company: dto.company ?? null,
        position: dto.position ?? null,
        referral: dto.referral,
        plan: dto.plan,
      })
      .select('id, created_at')
      .single();

    if (error) {
      this.logger.error('Create registration failed', error);
      throw new BadRequestException('Đăng ký thất bại, vui lòng thử lại');
    }

    this.sendLarkIndividual({
      courseTitle: course['title'] as string,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      company: dto.company,
      position: dto.position,
      referral: dto.referral,
      plan: dto.plan,
      createdAt: data['created_at'] as string,
    }).catch((err: unknown) => this.logger.error('Lark notification failed', err));

    return {
      id: data['id'],
      message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      createdAt: data['created_at'],
    };
  }

  // ─────────────────────────────────────────────
  // Đăng ký nhóm (2 người, 1 request)
  // ─────────────────────────────────────────────
  async createGroup(dto: CreateGroupRegistrationDto) {
    const course = await this.verifyCourse(dto.course_id);

    // Check duplicate email cho từng member
    for (const member of dto.members) {
      const { data: existing } = await this.supabase
        .from('registrations')
        .select('id')
        .eq('course_id', dto.course_id)
        .eq('email', member.email)
        .maybeSingle();

      if (existing) {
        throw new BadRequestException(
          `Email "${member.email}" đã đăng ký khóa học này rồi`,
        );
      }
    }

    // Check 2 member không được dùng cùng email
    const emails = dto.members.map((m) => m.email.toLowerCase());
    if (new Set(emails).size !== emails.length) {
      throw new BadRequestException('Hai thành viên không được dùng cùng địa chỉ email');
    }

    // Insert tất cả members
    const rows = dto.members.map((m) => ({
      course_id: dto.course_id,
      full_name: m.full_name,
      phone: m.phone,
      email: m.email,
      company: m.company ?? null,
      position: m.position ?? null,
      referral: dto.referral,
      plan: 'group',
    }));

    const { data, error } = await this.supabase
      .from('registrations')
      .insert(rows)
      .select('id, created_at');

    if (error) {
      this.logger.error('Create group registration failed', error);
      throw new BadRequestException('Đăng ký thất bại, vui lòng thử lại');
    }

    const createdAt = (data[0] as { created_at: string })?.created_at ?? new Date().toISOString();

    this.sendLarkGroup({
      courseTitle: course['title'] as string,
      members: dto.members,
      referral: dto.referral,
      createdAt,
    }).catch((err: unknown) => this.logger.error('Lark group notification failed', err));

    return {
      message: 'Đăng ký nhóm thành công! Chúng tôi sẽ liên hệ sớm nhất.',
      count: dto.members.length,
    };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────
  private async verifyCourse(courseId: string) {
    const { data: course, error } = await this.supabase
      .from('courses')
      .select('id, title, status')
      .eq('id', courseId)
      .single();

    if (error || !course) throw new NotFoundException('Không tìm thấy khóa học');
    if (course['status'] !== 'upcoming') {
      throw new BadRequestException('Khóa học này không còn nhận đăng ký');
    }
    return course;
  }

  private async sendLarkIndividual(params: {
    courseTitle: string;
    fullName: string;
    phone: string;
    email: string;
    company?: string;
    position?: string;
    referral: string;
    plan: 'individual' | 'group';
    createdAt: string;
  }): Promise<void> {
    const webhookUrl = this.config.get<string>('lark.webhookUrl');
    if (!webhookUrl) return;

    const planLabel = params.plan === 'group' ? 'Nhóm 2 người' : 'Cá nhân (1 người)';
    const companyLine = params.company ? `\nCông ty: ${params.company}` : '';
    const positionLine = params.position ? `\nChức vụ: ${params.position}` : '';
    const vnTime = this.toVnTime(params.createdAt);

    const body = [
      `🆕 Đăng ký khóa học mới!`,
      `Khóa học: ${params.courseTitle}`,
      `Họ tên: ${params.fullName}`,
      `Điện thoại: ${params.phone}`,
      `Email: ${params.email}${companyLine}${positionLine}`,
      `Nguồn: ${params.referral}`,
      `Gói: ${planLabel}`,
      `Thời gian: ${vnTime}`,
    ].join('\n');

    await this.postLark(body);
  }

  private async sendLarkGroup(params: {
    courseTitle: string;
    members: Array<{ full_name: string; phone: string; email: string; company?: string; position?: string }>;
    referral: string;
    createdAt: string;
  }): Promise<void> {
    const webhookUrl = this.config.get<string>('lark.webhookUrl');
    if (!webhookUrl) return;

    const vnTime = this.toVnTime(params.createdAt);

    const memberLines = params.members
      .map((m, i) => {
        const companyLine = m.company ? `\n   Công ty: ${m.company}` : '';
        const positionLine = m.position ? `\n   Chức vụ: ${m.position}` : '';
        return `👤 Người ${i + 1}: ${m.full_name}\n   📞 ${m.phone} | ✉️ ${m.email}${companyLine}${positionLine}`;
      })
      .join('\n\n');

    const body = [
      `🆕 Đăng ký NHÓM 2 người mới!`,
      `Khóa học: ${params.courseTitle}`,
      `Nguồn: ${params.referral}`,
      ``,
      memberLines,
      ``,
      `Thời gian: ${vnTime}`,
    ].join('\n');

    await this.postLark(body);
  }

  private async postLark(body: string): Promise<void> {
    const webhookUrl = this.config.get<string>('lark.webhookUrl');
    if (!webhookUrl) {
      this.logger.warn('LARK_WEBHOOK_URL chưa được cấu hình');
      return;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body,
    });

    if (!response.ok) {
      this.logger.warn(`Lark webhook HTTP ${response.status}: ${await response.text()}`);
    }
  }

  private toVnTime(isoString: string): string {
    return new Date(new Date(isoString).getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
  }
}
