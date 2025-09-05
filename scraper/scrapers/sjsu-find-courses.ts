import axios from 'axios';
import * as cheerio from 'cheerio';

export function getSemester(): string {
  const currentMonth = new Date().getMonth(); // JavaScript months are 0-based
  const currentYear = new Date().getFullYear();

  if (currentMonth >= 3 && currentMonth < 8) {
    return `fall-${currentYear}`;
  } else if (currentMonth >= 0 && currentMonth <= 2) {
    return `spring-${currentYear}`;
  } else {
    return `spring-${currentYear + 1}`;
  }
}

export async function fetchAllCourses() {
  const semester = getSemester();
  const url = `https://www.sjsu.edu/classes/schedules/${semester}.php`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const table = $('table#classSchedule');
    if (table.length) {
      let uniqueCourses = new Set<string>();
      let courses: any[] = [];

      table.find('tbody tr').each((_, element) => {
        const cells = $(element).find('td');
        if (cells.length >= 10) {
          const title = cells.eq(3).text().trim();
          const subject = cells.eq(0).text().trim().split(' ')[0];
          const courseNumber = cells.eq(0).text().trim().split(' ')[1];
          // courses sometimes have two professors listed in a course so dealt with it by splitting with / and adding two professors_courses with both professors listed
          const rawProfessor = cells.eq(9).text().trim();

          const professors = [
            ...new Set(
              rawProfessor
                .split(' / ')
                //sometimes pronouns are listed so remove them with replace. Replace accented letters with normalize then replace
                .map((name) =>
                  name
                    .replace(/\s*\([^)]*\)/g, '')
                    .normalize('NFKD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .trim(),
                ),
            ),
          ];

          professors.forEach((professor) => {
            const course = {
              semester,
              title,
              subject,
              courseNumber,
              professor,
            };
            const courseString = JSON.stringify(course);
            if (!uniqueCourses.has(courseString)) {
              uniqueCourses.add(courseString);
              courses.push(course);
            }
          });
        }
      });

      return courses;
    } else {
      console.error('No table found');
      return [];
    }
  } catch (error) {
    console.error('Error: Unable to fetch data. ${error}');
    return [];
  }
}
