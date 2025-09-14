import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coursesTable } from '@/lib/db/schema';

// ✅ Fetch all courses from DB
export async function getCourses() {
  return db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      subject: coursesTable.subject,
      courseNumber: coursesTable.courseNumber,
    })
    .from(coursesTable)
    .orderBy(asc(coursesTable.subject));
}

// ✅ Fetch a single course by ID
export async function getCourseById(courseId: number) {
  const courses = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      subject: coursesTable.subject,
      courseNumber: coursesTable.courseNumber,
    })
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId));

  return courses.length > 0 ? courses[0] : null;
}
