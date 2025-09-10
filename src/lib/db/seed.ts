import { db } from '.';
import {
  professorsTable,
  coursesTable,
  professorsCoursesTable,
  reviewsTable,
} from './schema';

const main = async () => {
  try {
    console.log('Seeding database');
    await db.delete(reviewsTable);
    await db.delete(professorsCoursesTable);
    await db.delete(professorsTable);
    await db.delete(coursesTable);

    console.log('Inserting data');
    const professors = [
      { id: 1, name: 'John Smith', department: 'Mathematics' },
      { id: 2, name: 'Jane Doe', department: 'Science' },
      { id: 3, name: 'Bob Johnson', department: 'History' },
      { id: 4, name: 'Alice Williams', department: 'Mathematics' },
      { id: 5, name: 'Charlie Brown', department: 'Science' },
      { id: 6, name: 'David Davis', department: 'History' },
      { id: 7, name: 'Eva Green', department: 'Computer Science' },
      { id: 8, name: 'Michael Brown', department: 'Engineering' },
    ];
    const courses = [
      {
        id: 1,
        semester: 'Fall 2025',
        title: 'Calculus',
        subject: 'MATH',
        courseNumber: '106',
        units: 4,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An introductory course to calculus',
      },
      {
        id: 2,
        semester: 'Fall 2025',
        title: 'Biology',
        subject: 'SCI',
        courseNumber: '105',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An introductory course to biology',
      },
      {
        id: 3,
        semester: 'Fall 2025',
        title: 'World War II',
        subject: 'HIST',
        courseNumber: '101',
                units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'A course about World War II',
      },
      {
        id: 4,
        semester: 'Fall 2025',
        title: 'Algebra',
        subject: 'MATH',
        courseNumber: '102',
                units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An introductory course to algebra',
      },
      {
        id: 5,
        semester: 'Fall 2025',
        title: 'Chemistry',
        subject: 'SCI',
        courseNumber: '113',
                units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An introductory course to chemistry',
      },
      {
        id: 6,
        semester: 'Fall 2025',
        title: 'World War I',
        subject: 'HIST',
        courseNumber: '121',
                units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'A course about World War I',
      },
      {
        id: 7,
        semester: 'Fall 2025',
        title: 'Advanced Calculus',
        subject: 'MATH',
        courseNumber: '201',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An advanced course in calculus',
      },
      {
        id: 8,
        semester: 'Fall 2025',
        title: 'Advanced Biology',
        subject: 'SCI',
        courseNumber: '241',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An advanced course in biology',
      },
      {
        id: 9,
        semester: 'Fall 2025',
        title: 'The Civil War',
        subject: 'HIST',
        courseNumber: '220',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'A course about The Civil War',
      },
      {
        id: 10,
        semester: 'Fall 2025',
        title: 'Introduction to Programming',
        subject: 'COMPSCI',
        courseNumber: '101',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'An introductory course to programming',
      },
      {
        id: 11,
        semester: 'Fall 2025',
        title: 'Engineering Principles',
        subject: 'ENG',
        courseNumber: '102',
        units: 3,
        type: 'LEC',
        days: 'MW',
        time: '9:00 AM - 11:00 AM',
        description: 'Fundamentals of engineering',
      },
    ];
    const professorsCourses = [
      { professorId: 1, courseId: 1 },
      { professorId: 1, courseId: 4 },
      { professorId: 1, courseId: 7 },
      { professorId: 2, courseId: 2 },
      { professorId: 2, courseId: 5 },
      { professorId: 2, courseId: 8 },
      { professorId: 3, courseId: 3 },
      { professorId: 3, courseId: 6 },
      { professorId: 3, courseId: 9 },
      { professorId: 4, courseId: 1 },
      { professorId: 4, courseId: 4 },
      { professorId: 4, courseId: 7 },
      { professorId: 5, courseId: 2 },
      { professorId: 5, courseId: 5 },
      { professorId: 5, courseId: 8 },
      { professorId: 7, courseId: 10 },
      { professorId: 8, courseId: 11 },
    ];
    const reviews = [
      {
        id: 1,
        rating: 4,
        review: 'Great course, would recommend',
        courseId: 1,
        professorId: 1,
      },
      {
        id: 2,
        rating: 2,
        review: 'Terrible course, would not reccommend',
        courseId: 4,
        professorId: 1,
      },
    ];

    await db.insert(professorsTable).values(professors);
    await db.insert(coursesTable).values(courses);
    await db.insert(professorsCoursesTable).values(professorsCourses);
    await db.insert(reviewsTable).values(reviews);
    console.log('Database seeded, press Ctrl+C to exit');
  } catch (error) {
    console.error(error);
    throw new Error('Error seeding database');
  }
};

main();
