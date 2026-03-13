import { and, eq, sql } from 'drizzle-orm';
import { rmpFindAllProfessors } from '../../../scraper/scrapers/rmp-find-professors';
import { fetchAllCourses } from '../../../scraper/scrapers/sjsu-find-courses';
import { db } from '.';
import {
  coursesTable,
  professorsCoursesTable,
  professorsTable,
  reviewsTable,
} from './schema';

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function isSameProfessor(
  courseProfessor: string,
  rmpProfessor: { firstName: string; lastName: string },
): boolean {
  const courseParts = normalizeName(courseProfessor).split(' ');
  const rmpFullName = normalizeName(
    `${rmpProfessor.firstName} ${rmpProfessor.lastName}`,
  );
  const rmpParts = rmpFullName.split(' ');

  if (rmpParts.length === 2) {
    const courseFirst = courseParts[0];
    const courseLast = courseParts[courseParts.length - 1];
    const rmpFirst = rmpParts[0];
    const rmpLast = rmpParts[1];

    return courseFirst === rmpFirst && courseLast === rmpLast;
  } else {
    return normalizeName(courseProfessor) === rmpFullName;
  }
}

export async function insertProfessors() {
  const existingProfessors = await db.select().from(professorsTable);
  const professors = await rmpFindAllProfessors();
  for (const professor of professors) {
    // Some name entries have a space at the end so remove with replace. Some names also have accents so have to normalize and replace
    const fullName = `${professor.firstName.replace(/\s*$/, '')} ${professor.lastName.replace(/\s*$/, '')}`;
    const department = professor.department;
    const exists = existingProfessors.some(
      (p) => p.name === fullName && p.department === department,
    );
    if (!exists) {
      const newProfessor = await db
        .insert(professorsTable)
        .values({
          name: fullName,
          department: department,
          avgRating: professor.avgRating
            ? Math.round(professor.avgRating * 10) / 10
            : null,
          avgDifficulty: professor.avgDifficulty
            ? Math.round(professor.avgDifficulty * 10) / 10
            : null,
          numRatings: professor.numRatings,
          wouldTakeAgainPercent: professor.wouldTakeAgainPercent,
        })
        .returning();
      console.log('Added: ', newProfessor);
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
  // Group courses by all fields except professor
  const courseMap = new Map();
  for (const course of courses) {
    const {
      semester,
      title,
      subject,
      courseNumber,
      classNumber,
      units,
      type,
      days,
      time,
      location,
      dates,
      openSeats,
      professor,
    } = course;
    // Key without professor
    const key = JSON.stringify({
      semester,
      title,
      subject,
      courseNumber,
      classNumber,
      units,
      type,
      days,
      time,
      location,
      dates,
      openSeats,
    });
    if (!courseMap.has(key)) {
      courseMap.set(key, { ...course, professors: [] });
    }
    courseMap.get(key).professors.push(professor);
  }

  for (const courseObj of courseMap.values()) {
    try {
      const {
        semester,
        title,
        subject,
        courseNumber,
        classNumber,
        units,
        type,
        days,
        time,
        location,
        dates,
        openSeats,
        professors,
      } = courseObj;

      //check if course already exists in the courses table
      const existingCourse = await db
        .select()
        .from(coursesTable)
        .where(
          and(
            eq(coursesTable.subject, subject),
            eq(coursesTable.courseNumber, courseNumber),
            eq(coursesTable.classNumber, classNumber),
            eq(coursesTable.units, units),
            eq(coursesTable.type, type),
            eq(coursesTable.days, days),
            eq(coursesTable.time, time),
            eq(coursesTable.location, location),
            eq(coursesTable.dates, dates),
            eq(coursesTable.openSeats, openSeats),
          ),
        )
        .limit(1);
      let courseId;
      if (existingCourse.length > 0) {
        courseId = existingCourse[0].id;
      } else {
        const insertedCourse = await db
          .insert(coursesTable)
          .values({
            semester,
            title,
            subject,
            courseNumber,
            classNumber,
            units,
            type,
            days,
            time,
            location,
            dates,
            openSeats,
          })
          .returning({ id: coursesTable.id });
        courseId = insertedCourse[0].id;
      }

      // For each professor, associate with course
      for (const professor of professors) {
        let firstName = '';
        let lastName = '';
        if (professor) {
          const parts = professor.trim().split(/\s+/);
          if (parts.length === 1) {
            firstName = parts[0];
          } else if (parts.length > 1) {
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
          }
        }
        const existingProfessor = allProfessors.find((_p) =>
          isSameProfessor(_p.name, {
            firstName,
            lastName,
          }),
        );
        if (!existingProfessor) {
          console.error(
            `Professor ${professor} not found for ${subject}${courseNumber} ${classNumber}`,
          );
          professorNotFound++;
          continue;
        }
        const professorId = existingProfessor.id;
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
        if (existingProfCourse.length === 0) {
          await db.insert(professorsCoursesTable).values({
            professorId,
            courseId,
          });
          added++;
        } else {
          alreadyExists++;
        }
      }
    } catch (error) {
      console.error(`Error processing course ${courseObj.title}:`, error);
    }
  }
  console.log(
    `Summary: Attempted to add ${attempted} courses. Successfully added: ${added}. Already existed: ${alreadyExists}. Professors not found: ${professorNotFound}.`,
  );
}

const main = async () => {
  // First insert implementation
  try {
    //reset everything
    await db.delete(reviewsTable);
    await db.delete(professorsCoursesTable);
    await db.delete(professorsTable);
    await db.delete(coursesTable);
    await db.execute(sql`ALTER SEQUENCE professors_id_seq RESTART WITH 1;`);
    await db.execute(sql`ALTER SEQUENCE courses_id_seq RESTART WITH 1;`);
    //actual adding done here
    console.log('Adding to database');
    await insertProfessors();
    await insertCourses();
    console.log('Completed adding to database');
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error('Error adding to database');
  }
};

main();
