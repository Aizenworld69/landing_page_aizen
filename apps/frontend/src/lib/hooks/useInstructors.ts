'use client';

import { useState, useEffect } from 'react';
import { getInstructors } from '@/lib/api/instructors.api';
import type { Instructor } from '@aizen/types';

export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getInstructors()
      .then(setInstructors)
      .catch((err) => setError(err instanceof Error ? err.message : 'Lỗi tải giảng viên'))
      .finally(() => setIsLoading(false));
  }, []);

  return { instructors, isLoading, error };
}
