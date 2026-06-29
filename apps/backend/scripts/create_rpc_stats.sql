-- 1. Create UNIQUE constraint to avoid race conditions on registrations
-- Chạy câu lệnh này đầu tiên:
ALTER TABLE registrations ADD CONSTRAINT uq_reg_course_email UNIQUE (course_id, email);

-- 2. Create PostgreSQL function for optimized stats aggregation
-- Chạy câu lệnh này tiếp theo:
CREATE OR REPLACE FUNCTION get_registration_stats()
RETURNS json AS $$
  SELECT json_build_object(
    'total', (SELECT COUNT(*)::integer FROM registrations),
    'today', (SELECT COUNT(*)::integer FROM registrations WHERE created_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')::date),
    'byCourse', (
      SELECT COALESCE(json_agg(t), '[]'::json)
      FROM (
        SELECT 
          r.course_id AS "courseId",
          COALESCE(c.title, r.course_id::text) AS "title",
          COUNT(*)::integer AS "count"
        FROM registrations r
        LEFT JOIN courses c ON r.course_id = c.id
        GROUP BY r.course_id, c.title
        ORDER BY COUNT(*) DESC
      ) t
    )
  );
$$ LANGUAGE sql;
