import { StarRating } from "@/components/star-rating"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { coursesTable, professorsCoursesTable, professorsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const professorResult = await db
    .select()
    .from(professorsTable)
    .where(eq(professorsTable.id, Number(params.id)))

  if (professorResult.length > 0) {
    const professor = professorResult[0];
    return {
      title: `Spartan Compass | ${professor.name}`,
    };
  }
  
  return {
    title: 'Spartan Compass | Professor',
  };
}

export default async function ProfessorPage({ params }: { params: { id: string } }) {
  const professorResult = await db
    .select()
    .from(professorsTable)
    .where(eq(professorsTable.id, Number(params.id)))

  const courseResult = await db
    .select()
    .from(professorsCoursesTable)
    .where(eq(professorsCoursesTable.professorId, Number(params.id)))
    .innerJoin(coursesTable, eq(professorsCoursesTable.courseId, coursesTable.id));

  return (
    <div className="container mx-auto p-4">
      <div className="grid">
        {professorResult.map((professor) => (
          <Card key={professor.id} className="overflow-hidden mt-4">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-4xl">{professor.name}</CardTitle>
              <p className="text-primary-foreground">{professor.department}</p>
              <div className="mt-2">
                {/* The actual rating is a placeholder, the professorsTable scheme has not been updated to have starRating as a field */}
                <StarRating rating={4.5} textColor="text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              {courseResult.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseResult.map((result, index) => (
                      <Card key={index} className="p-4">
                        <CardHeader>
                          <Link href={`/courses/${result.courses.id}`}>
                            <CardTitle className="text-lg font-semibold hover:text-primary hover:underline">
                              {result.courses.subject} {result.courses.courseNumber}: {result.courses.title}
                            </CardTitle>
                          </Link>
                        </CardHeader>
                        <CardContent>
                          <div className="mt-2">
                            {/* The actual rating is a placeholder, the professorsTable scheme has not been updated to have starRating as a field */}
                            <StarRating rating={4.5} textColor="text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No courses found
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

