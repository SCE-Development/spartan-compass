import ReviewInput from "@/components/review-input";

import { db } from "@/lib/db";
import { coursesTable, professorsCoursesTable, professorsTable } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

const getCourses = async () => {
    return db
    .select({
      courseNumber: coursesTable.courseNumber,
      courseSubject: coursesTable.subject,
      courseId: coursesTable.id,
      professorName: professorsTable.name,
      professorId: professorsTable.id,
    })
    .from(professorsCoursesTable)
    .innerJoin(coursesTable, eq(professorsCoursesTable.courseId, coursesTable.id))
    .innerJoin(professorsTable, eq(professorsCoursesTable.professorId, professorsTable.id))
    .orderBy(asc(professorsCoursesTable.professorId))
};

export type CourseResult = Awaited<ReturnType<typeof getCourses>>[number];

export default async function Page() {
    const result = await getCourses();
    return (
        <div>
            <br />
            <ReviewInput result={result}/>
        </div>
    )
}