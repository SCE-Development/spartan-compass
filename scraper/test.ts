import { rmpFindProfessorsPage } from './scrapers/rmp-find-professors';
import { fetchAllCourses } from './scrapers/sjsu-find-courses';

const sampleCount = 2;

async function main() {
  const profData = await rmpFindProfessorsPage({
    cursor: '',
    count: sampleCount,
  });
  console.log('RMP scraped professors', profData.edges);
  console.log('RMP scraped professors page info', profData.pageInfo);

  const classData = await fetchAllCourses();
  console.log('SJSU scraped courses', classData.slice(0, sampleCount));

  console.log('Total professors scraped:', profData.edges.length);
  console.log('Total courses scraped:', classData.length);
}

main();
