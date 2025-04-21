import { StarRating } from "@/components/star-rating";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import {
  coursesTable,
  professorsCoursesTable,
  professorsTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
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
    .innerJoin(professorsTable, eq(professorsCoursesTable.professorId, professorsTable.id));


  return (
    <div className="container mx-auto p-4">
      <div className="grid">
        {courseResult.map((course) => (
          <Card key={course.id} className="overflow-hidden mt-4">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-4xl">{`${course.title} (${course.subject} ${course.courseNumber})`}</CardTitle>
              <p className="text-primary-foreground">{course.description}</p>

              <div className="mt-2">
                {/* The actual rating is a placeholder, the coursesTable scheme has not been updated to have starRating as a field */}
                <StarRating rating={4.5} textColor="text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professorResult.map((result, index) => (
                  <Card key={index} className="p-4">
                    <CardHeader>
                      <Link href={`/professors/${result.professor.id}`}>
                        <CardTitle className="text-lg font-semibold hover:text-primary hover:underline">
                          {result.professor.name}
                        </CardTitle>
                      </Link>
                      <p className="text-muted-foreground">
                        {result.professor.department}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2">
                        {result.professor.avgRating ? (
                          <StarRating
                            rating={result.professor.avgRating}
                            textColor="text-muted-foreground"
                          />
                        ) : (
                          <span className="text-sm italic text-muted-foreground">No rating</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
