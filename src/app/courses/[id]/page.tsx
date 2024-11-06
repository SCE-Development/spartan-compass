import { StarRating } from "@/components/star-rating";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import {
  coursesTable,
  professorsCoursesTable,
  professorsTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    .select()
    .from(professorsCoursesTable)
    .where(eq(professorsCoursesTable.courseId, Number(params.id)))
    .then((res) => {
      return db
        .select()
        .from(professorsTable)
        .where(eq(professorsTable.id, res[0].professorId));
    });

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
                <StarRating rating={4.5} />
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              {professorResult.map((professor) => (
                <div key={professor.id}>
                  <p className="text-lg font-semibold mb-2">{professor.name}</p>
                  <p className="text-muted-foreground">
                    {professor.department}
                  </p>
                  <div className="mt-2">
                    {/* The actual rating is a placeholder, the professorsTable scheme has not been updated to have starRating as a field */}
                    <StarRating rating={4.5} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
