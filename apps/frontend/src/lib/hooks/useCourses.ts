'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCourses, type CourseQuery } from '@/lib/api/courses.api';
import type { Course, PaginatedResponse } from '@aizen/types';

const EMPTY: PaginatedResponse<Course> = {
  items: [],
  pagination: { total: 0, page: 1, limit: 9, totalPages: 0 },
};

export function useCourses(initialQuery: CourseQuery = {}) {
  const [query, setQuery] = useState<CourseQuery>(initialQuery);
  const [data, setData] = useState<PaginatedResponse<Course>>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (q: CourseQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCourses(q);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải khóa học');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch(query);
  }, [query, fetch]);

  return { data, isLoading, error, setQuery, refetch: () => fetch(query) };
}
