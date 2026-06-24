import { apiClient } from './api-client';
import type { Registration } from '@aizen/types';

export interface CreateRegistrationDto {
  courseId: string;
  fullName: string;
  phone: string;
  email: string;
  company?: string;
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
      plan: dto.plan,
    },
  );
  return data;
}
