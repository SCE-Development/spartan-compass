import {rmpFindProfessors} from "./scrapers/rmp-find-professors";

async function main() {
  const data = await rmpFindProfessors({cursor: "", count: 5});
  console.log(JSON.stringify(data, null, "  "));
}

main();
