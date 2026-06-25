import { apiClient } from './api-client';
import type { Registration } from '@aizen/types';

// ─── Individual registration ─────────────────────────
export interface CreateRegistrationDto {
  courseId: string;
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  position?: string;
  referral: string;
  plan: 'individual' | 'group';
}

export async function createRegistration(
  dto: CreateRegistrationDto,
): Promise<{ message: string; data: Registration }> {
  const { data } = await apiClient.post<{ message: string; data: Registration }>(
    '/registrations',
    {
      course_id: dto.courseId,
      full_name: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      company: dto.company,
      position: dto.position,
      referral: dto.referral,
      plan: dto.plan,
    },
  );
  return data;
}

// ─── Group registration (2 members) ─────────────────
export interface GroupMemberDto {
  fullName: string;
  phone: string;
  email: string;
  company?: string;
  position?: string;
}

export interface CreateGroupRegistrationDto {
  courseId: string;
  referral: string;
  members: GroupMemberDto[];
}

export async function createGroupRegistration(
  dto: CreateGroupRegistrationDto,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/registrations/group',
    {
      course_id: dto.courseId,
      referral: dto.referral,
      members: dto.members.map((m) => ({
        full_name: m.fullName,
        phone: m.phone,
        email: m.email,
        company: m.company,
        position: m.position,
      })),
    },
  );
  return data;
}
