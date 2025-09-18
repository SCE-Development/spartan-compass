import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import AddReviewForm from '@/components/AddReviewForm';
import { StarRating } from '@/components/star-rating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import {
  coursesTable,
  professorsCoursesTable,
  professorsTable,
} from '@/lib/db/schema';
import { Button } from '@/components/ui/button';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const courseResult = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, Number(params.id)));

  if (courseResult.length > 0) {
    const course = courseResult[0];
    return {
      title: `Spartan Compass | ${course.subject} ${course.courseNumber}`,
    };
  }

  return {
    title: 'Spartan Compass | Course',
  };
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({
  params: paramsPromise,
}: RouteContext) {
  const params = await paramsPromise;
  const courseResult = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, Number(params.id)));

  const professorResult = await db
    .select({
      professor: professorsTable,
    })
    .from(professorsCoursesTable)
    .where(eq(professorsCoursesTable.courseId, Number(params.id)))
    .innerJoin(
      professorsTable,
      eq(professorsCoursesTable.professorId, professorsTable.id),
    );

  const professorCourseResult = await db
    .select()
    .from(professorsCoursesTable)
    .where(eq(professorsCoursesTable.courseId, Number(params.id)));

  return (
    <div className="container mx-auto p-4">
      <div className="grid">
        {courseResult.map((course) => (
          <Card key={course.id} className="overflow-hidden mt-4">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-4xl">{`${course.title} (${course.subject} ${course.courseNumber})`}</CardTitle>
              <p className="text-primary-foreground">{course.classNumber}</p>
              <p className="text-primary-foreground">Units: {course.units} | Type: {course.type}</p>
              <p className="text-primary-foreground">{course.description}</p>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professorResult.map((result) => (
                  <Card key={result.professor.id} className="p-4">
                    <CardHeader>
                      <Link href={`/professors/${result.professor.id}`}>
                        <CardTitle className="text-lg font-semibold hover:text-primary hover:underline">
                          {result.professor.name}
                        </CardTitle>
                      </Link>
                      <p className="text-muted-foreground">
                        {result.professor.department}
                      </p>
                      <p className="text-sm">
                          {
                            professorCourseResult.filter((professorCourse) =>
                              professorCourse.professorId === result.professor.id,
                            ).map((professorCourse) => (
                              courseResult.filter((course) =>
                                professorCourse.courseId === course.id,
                              ).map((course) => (
                                <span key={course.id} className="flex flex-col">
                                  <span>{course.location} | {course.days} | {course.time} | {course.dates}</span>
                                  <span>Open Seats: {course.openSeats}</span>
                                </span>
                              ))
                            ))
                          }
                      </p>
                    </CardHeader>
                    <CardContent className='flex flex-row justify-between'>
                      <div className="mt-2">
                        {result.professor.avgRating ? (
                          <StarRating
                            rating={result.professor.avgRating}
                            textColor="text-muted-foreground"
                          />
                        ) : (
                          <span className="text-sm italic text-muted-foreground">
                            No ratings yet
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <Button className='disabled:cursor-not-allowed' disabled>Add To Cart</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddReviewForm />
    </div>
  );
}
