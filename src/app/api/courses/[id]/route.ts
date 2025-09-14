// app/api/courses/[id]/route.ts

import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coursesTable } from '@/lib/db/schema';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const courseId = Number(id);

  try {
    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        subject: coursesTable.subject,
        courseNumber: coursesTable.courseNumber,
        description: coursesTable.description,
      })
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId));

    if (courses.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Ensure courseNumber is always a string
    const course = courses[0];
    const formattedCourse = {
      ...course,
      courseNumber: String(course.courseNumber),
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
