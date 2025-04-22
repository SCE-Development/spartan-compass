import { db } from ".";
import { sql, eq, and } from "drizzle-orm";
import { rmpFindAllProfessors } from "../../../scraper/scrapers/rmp-find-professors";
import {
  fetchAllCourses,
  getSemester,
} from "../../../scraper/scrapers/sjsu-find-courses";
import {
  professorsTable,
  coursesTable,
  professorsCoursesTable,
  reviewsTable,
} from "./schema";
import { rmpFindAllProfessorReviews } from "../../../scraper/scrapers/rmp-find-reviews";
import assert from "node:assert";

export async function insertProfessors() {
  const existingProfessors = await db.select().from(professorsTable);
  const professors = await rmpFindAllProfessors();
  for (const professor of professors) {
    // Some name entries have a space at the end so remove with replace. Some names also have accents so have to normalize and replace
    const fullName = `${professor.firstName.replace(/\s*$/, "")} ${professor.lastName.replace(/\s*$/, "")}`;
    const department = professor.department;
    const exists = existingProfessors.some(
      (p) => p.name === fullName && p.department === department,
    );
    if (!exists) {
      const newProfessor = await db
        .insert(professorsTable)
        .values({
          name: fullName,
          rmpId: professor.id,
          rmpLegacyId: professor.legacyId,
          department: department,
        })
        .returning();
      // console.log("Added: ", newProfessor);
    }
  }
}

export async function insertReviews() {
  // const professors = await db.query.professorsTable.findMany({
  //   with: {
  //     id: true,
  //     rmpId: true,
  //   },
  //   limit: 10,
  // });
  const professors = await db.select({
    id: professorsTable.id,
    rmpId: professorsTable.rmpId,
  }).from(professorsTable).limit(10);

  for (const professor of professors) {
    console.log("Inserting reviews for professor:", professor.id);
    await insertProfessorReviews(professor);
  }
}

export async function insertProfessorReviews(professor: {
  id: number;
  rmpId: string | null;
}) {
  assert(
    professor.rmpId !== null,
    "Professor must have an RMP ID to scrape reviews",
  );
  const reviews = await rmpFindAllProfessorReviews(professor.rmpId);
  for (const review of reviews) {
    const classRegex = /([A-Z]{2,4})\s*(\d{1,3}[A-Z]*)/;

    const match = review.class.match(classRegex);
    if (!match) {
      console.error("RMP reviews: Couldn't parse class :", review.class);
      continue;
    }

    const subject = match[1];
    const courseNumber = match[2];
    // const course = await db.query.coursesTable.findFirst({
    //   with: { id: true },
    //   where: (course, { eq }) => eq(course.subject, subject) && eq(course.courseNumber, courseNumber),
    // });
    const courses = await db.select({id: coursesTable.id}).from(coursesTable).where(
      and(
        eq(coursesTable.subject, subject),
        eq(coursesTable.courseNumber, courseNumber),
      ),
    ).limit(1);
    const course = courses.at(0);
    if (!course) {
      console.log("Course not found:", review.class);
      continue;
    }
    await db.insert(reviewsTable).values({
      rmpId: review.id,
      rating: review.helpfulRating,
      review: review.comment,
      courseId: course.id,
      professorId: professor.id,
    });
  }
}

export async function insertCourses() {
  const courses = await fetchAllCourses();
  const attempted = courses.length;
  let added = 0;
  let alreadyExists = 0;
  let professorNotFound = 0;
  for (const course of courses) {
    try {
      const semester = getSemester();
      const { title, subject, courseNumber, professor } = course;

      //check if professor for course exists
      const existingProfessor = await db
        .select()
        .from(professorsTable)
        .where(eq(sql`LOWER(${professorsTable.name})`, professor.toLowerCase()))
        .limit(1);
      //if professor does not exist for course don't add and continue
      if (existingProfessor.length === 0) {
        console.error(
          `Professor ${professor} not found for ${subject}${courseNumber}`,
        );
        professorNotFound++;
        continue;
      }
      const professorId = existingProfessor[0].id;

      //check if course already exists in the courses table
      const existingCourse = await db
        .select()
        .from(coursesTable)
        .where(
          and(
            eq(coursesTable.subject, subject),
            eq(coursesTable.courseNumber, courseNumber),
          ),
        )
        .limit(1);
      //if course already exists in courses table then check if professorCourse exists
      if (existingCourse.length > 0) {
        const courseId = existingCourse[0].id;
        const existingProfCourse = await db
          .select()
          .from(professorsCoursesTable)
          .where(
            and(
              eq(professorsCoursesTable.professorId, professorId),
              eq(professorsCoursesTable.courseId, courseId),
            ),
          )
          .limit(1);
        //if professorCourse does not exists add else don't add
        if (existingProfCourse.length === 0) {
          await db.insert(professorsCoursesTable).values({
            professorId,
            courseId,
          });
          added++;
        } else {
          console.log(
            `Course ${subject}${courseNumber} with ${professor} already exists`,
          );
          alreadyExists++;
        }
        //if course does not exists in courses table add to both courses table and professorCourse
      } else {
        const insertedCourse = await db
          .insert(coursesTable)
          .values({
            semester,
            title,
            subject,
            courseNumber,
          })
          .returning({ id: coursesTable.id });

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
  console.log(
    `Summary: Attempted to add ${attempted} courses. Successfully added: ${added}. Already existed: ${alreadyExists}. Professors not found: ${professorNotFound}.`,
  );
}

const main = async () => {
  // First insert implementation
  // try {
  // reset everything
  // await db.delete(reviewsTable);
  // await db.delete(professorsCoursesTable);
  // await db.delete(professorsTable);
  // await db.delete(coursesTable);
  // await db.execute(sql`ALTER SEQUENCE professors_id_seq RESTART WITH 1;`);
  // await db.execute(sql`ALTER SEQUENCE courses_id_seq RESTART WITH 1;`);
  //actual adding done here
  console.log("Adding to database");
  // await insertProfessors();
  // await insertCourses();
  await insertReviews();
  console.log("Complete, ctrl + c to exit");
  // } catch (error) {
  //   console.error(error);
  //   throw new Error("Error adding to database");
  // }
};

main();
