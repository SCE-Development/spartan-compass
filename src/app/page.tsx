import Search from "@/components/search";
import { db } from "@/lib/db";
import { coursesTable } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

const getCourses = async () => {
  return db
    .select({
      id: coursesTable.id,
      semester: coursesTable.semester,
      title: coursesTable.title,
      subject: coursesTable.subject,
      courseNumber: coursesTable.courseNumber,
    })
    .from(coursesTable)
    .orderBy(asc(coursesTable.subject));
};

export type CourseResult = Awaited<ReturnType<typeof getCourses>>[number];

export default async function Home() {
  const result = await getCourses();

  return <Search result={result} />;
}
