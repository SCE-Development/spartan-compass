import { db } from ".";
import { sql, eq, and } from "drizzle-orm";
import { fetchAllProfessors } from "../../../scraper/scrapers/rmp-find-professors";
import { fetchAllCourses, getSemester } from "../../../scraper/scrapers/sjsu-find-courses";
import {
    professorsTable,
    coursesTable,
    professorsCoursesTable,
    reviewsTable,
  } from "./schema";


export async function insertProfessors() {
    const existingProfessors = await db.select().from(professorsTable);
    const professors = await fetchAllProfessors();
    professors.forEach(async (professor) => {
        // Some name entries have a space at the end so remove with replace. Some names also have accents so have to normalize and replace
        const fullName = `${professor.node.firstName.replace(/\s*$/,'')} ${professor.node.lastName.replace(/\s*$/,'')}`;
        const department = professor.node.department;
        const exists = existingProfessors.some(
            p => p.name === fullName && p.department === department
        );
        if(!exists) {
            const newProfessor = await db.insert(professorsTable).values({
                name: fullName,
                department: department,
            }).returning();
            console.log("Added: ", newProfessor);
        }
    });
}

export async function insertCourses() {
    const courses = await fetchAllCourses();
    let attempted = courses.length;
    let added = 0;
    let alreadyExists = 0;
    let professorNotFound = 0;
    for (const course of courses) {
        try {
            const semester = getSemester();
            const { title, subject, courseNumber, professor } = course;
            
            //check if professor for course exists
            const existingProfessor = await db.select().from(professorsTable)
                .where(eq(sql`LOWER(${professorsTable.name})`, professor.toLowerCase()))
                .limit(1);
            //if professor does not exist for course don't add and continue
            if (existingProfessor.length === 0) {
                console.error(`Professor ${professor} not found for ${subject}${courseNumber}`);
                professorNotFound++;
                continue;
            }
            const professorId = existingProfessor[0].id;

            //check if course already exists in the courses table
            const existingCourse = await db.select().from(coursesTable)
                .where(and(
                    eq(coursesTable.subject, subject),
                    eq(coursesTable.courseNumber, courseNumber)
                ))
                .limit(1);
            //if course already exists in courses table then check if professorCourse exists 
            if (existingCourse.length > 0) {
                const courseId = existingCourse[0].id;
                const existingProfCourse = await db.select().from(professorsCoursesTable)
                    .where(and(
                        eq(professorsCoursesTable.professorId, professorId),
                        eq(professorsCoursesTable.courseId, courseId)
                    ))
                    .limit(1);
            //if professorCourse does not exists add else don't add
                if (existingProfCourse.length === 0) {
                    await db.insert(professorsCoursesTable).values({
                        professorId,
                        courseId
                    });
                    added++;
                } else {
                    console.log(`Course ${subject}${courseNumber} with ${professor} already exists`);
                    alreadyExists++;
                }
            //if course does not exists in courses table add to both courses table and professorCourse
            } else {
                const insertedCourse = await db.insert(coursesTable).values({
                    semester,
                    title,
                    subject,
                    courseNumber
                }).returning({ id: coursesTable.id });

                await db.insert(professorsCoursesTable).values({
                    professorId,
                    courseId: insertedCourse[0].id
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
        console.log("Adding to database")
        await insertProfessors()
        await insertCourses()
        console.log("Complete, ctrl + c to exit")
    } catch (error) {
        console.error(error);
        throw new Error("Error adding to database");
    }
}

main()

