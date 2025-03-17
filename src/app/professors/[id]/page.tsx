import { StarRating } from "@/components/star-rating"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { coursesTable, professorsCoursesTable, professorsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function ProfessorPage({ params }: { params: { id: string } }) {
  const professorResult = await db
    .select()
    .from(professorsTable)
    .where(eq(professorsTable.id, Number(params.id)))

  const courseResult = await db
    .select()
    .from(professorsCoursesTable)
    .where(eq(professorsCoursesTable.professorId, Number(params.id)))
    .then((res) => {
      return db.select().from(coursesTable).where(eq(coursesTable.id, res[0].courseId))
    })

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
              <h2 className="text-2xl font-bold mb-4">Courses</h2>
              {courseResult.map((course) => (
                <div key={course.id} className="mb-6 border-b pb-4 last:border-0">
                  <p className="text-lg font-semibold mb-2">{course.title}</p>
                  <p className="text-muted-foreground">{course.description}</p>
                  <div className="mt-2">
                    {/* The actual rating is a placeholder, the coursesTable scheme has not been updated to have starRating as a field */}
                    <StarRating rating={4.5} textColor="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

