import { db } from ".";
import { sql, eq, and } from "drizzle-orm";
import { rmpFindAllProfessors } from "../../../scraper/scrapers/rmp-find-professors";
import { fetchAllCourses, getSemester } from "../../../scraper/scrapers/sjsu-find-courses";
import {
  professorsTable,
  coursesTable,
  professorsCoursesTable,
  reviewsTable,
} from "./schema";

function normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  function isSameProfessor(courseProfessor: string, rmpProfessor: { firstName: string, lastName: string }): boolean {
    const courseParts = normalizeName(courseProfessor).split(' ');
    const rmpFullName = normalizeName(`${rmpProfessor.firstName} ${rmpProfessor.lastName}`);
    const rmpParts = rmpFullName.split(' ');
  
    if (rmpParts.length === 2) {
      // RMP only has first and last name → ignore SJSU middle names
      const courseFirst = courseParts[0];
      const courseLast = courseParts[courseParts.length - 1];
      const rmpFirst = rmpParts[0];
      const rmpLast = rmpParts[1];
  
      return courseFirst === rmpFirst && courseLast === rmpLast;
    } else {
      // RMP has more (e.g., first + middle + last) → match full normalized names
      return normalizeName(courseProfessor) === rmpFullName;
    }
  }

export async function insertProfessors() {
  const existingProfessors = await db.select().from(professorsTable);
  const professors = await rmpFindAllProfessors();
  for (const professor of professors) {
    const fullName = `${professor.firstName.replace(/\s*$/, '')} ${professor.lastName.replace(/\s*$/, '')}`;
    const department = professor.department;
    const exists = existingProfessors.some(
      (p) => p.name === fullName && p.department === department
    );

    if (!exists) {
      const newProfessor = await db.insert(professorsTable).values({
        name: fullName,
        department: department,
      }).returning();
      console.log("Added:", newProfessor);
    }
  }
}

export async function insertCourses() {
  const courses = await fetchAllCourses();
  const attempted = courses.length;
  let added = 0;
  let alreadyExists = 0;
  let professorNotFound = 0;

  const allProfessors = await db.select().from(professorsTable);

  for (const course of courses) {
    try {
      const semester = getSemester();
      const { title, subject, courseNumber, professor } = course;

      const existingProfessor = allProfessors.find((p) => isSameProfessor(professor, p.name));

      if (!existingProfessor) {
        console.error(`Professor ${professor} not found for ${subject}${courseNumber}`);
        professorNotFound++;
        continue;
      }

      const professorId = existingProfessor.id;

      const existingCourse = await db.select().from(coursesTable)
        .where(and(
          eq(coursesTable.subject, subject),
          eq(coursesTable.courseNumber, courseNumber)
        ))
        .limit(1);

      if (existingCourse.length > 0) {
        const courseId = existingCourse[0].id;
        const existingProfCourse = await db.select().from(professorsCoursesTable)
          .where(and(
            eq(professorsCoursesTable.professorId, professorId),
            eq(professorsCoursesTable.courseId, courseId)
          ))
          .limit(1);

        if (existingProfCourse.length === 0) {
          await db.insert(professorsCoursesTable).values({
            professorId,
            courseId,
          });
          added++;
        } else {
          console.log(`Course ${subject}${courseNumber} with ${professor} already exists`);
          alreadyExists++;
        }

      } else {
        const insertedCourse = await db.insert(coursesTable).values({
          semester,
          title,
          subject,
          courseNumber,
        }).returning({ id: coursesTable.id });

        await db.insert(professorsCoursesTable).values({
          professorId,
          courseId: insertedCourse[0].id,
        });
        added++;
      }

    } catch (error) {
      console.error(`Error processing course ${course.title}:`, error);
    }
  }

  console.log(`Summary: Attempted to add ${attempted} courses. Successfully added: ${added}. Already existed: ${alreadyExists}. Professors not found: ${professorNotFound}.`);
}

const main = async () => {
  try {
    await db.delete(reviewsTable);
    await db.delete(professorsCoursesTable);
    await db.delete(professorsTable);
    await db.delete(coursesTable);
    await db.execute(sql`ALTER SEQUENCE professors_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE courses_id_seq RESTART WITH 1;`);

    console.log("Adding to database");
    await insertProfessors();
    await insertCourses();
    console.log("Complete, ctrl + c to exit");
  } catch (error) {
    console.error(error);
    throw new Error("Error adding to database");
  }
};

main();
