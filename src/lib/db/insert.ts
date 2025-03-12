import { db } from ".";
import { sql } from "drizzle-orm";
import { fetchAllProfessors } from "../../../scraper/scrapers/rmp-find-professors";
import {
    professorsTable,
    coursesTable,
    professorsCoursesTable,
    reviewsTable,
  } from "./schema";


export async function insertProfessors() {
    const existingProfessors = await db.select().from(professorsTable);
    const professors = await fetchAllProfessors() || [];
    professors.forEach(async (professor) => {
        const fullName = `${professor.node.firstName} ${professor.node.lastName}`;
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

const main = async () => {
    // First insert implementation
    try {
        await db.delete(reviewsTable);
        await db.delete(professorsCoursesTable);
        await db.delete(professorsTable);
        await db.delete(coursesTable);
        await db.execute(sql`ALTER SEQUENCE professors_id_seq RESTART WITH 1;`);
        console.log("Adding Professors")
        insertProfessors()
    } catch (error) {
    console.error(error);
    throw new Error("Error adding professors to database");
    }
}

main()

