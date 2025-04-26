# Spartan Compass

## Setup
### Cloning the Repository

Install [git](https://git-scm.com/downloads) and clone the repo:

```sh
git clone https://github.com/SCE-Development/spartan-compass/
```
### Running the Database
1. Install Docker:

- For Windows: [here](https://docs.docker.com/desktop/windows/install/)
- For Mac: [here](https://docs.docker.com/desktop/mac/install/)
- For Linux: [here](https://docs.docker.com/desktop/linux/install/)


If you are going to do the tutorial in the wiki, finish the tutorial before proceeding with steps 2 - 7

2. `cp .env.example .env`
3. `npm run db:start`
4. `npm run db:generate` (This command is only needed when database schema changes are made)
5. `npm run db:migrate`
6. `npm run db:seed`

[//]: # (TODO: replace readme seed instructions)

Run `npm run db:studio` to access the database at `http://local.drizzle.studio`

> [!WARNING]
> If you need to, never delete the files themselves as this will mess with Drizzle. You should instead run:
> ```sh
> bun run db:drop
> ```

### Running the dev server
1. `npm install`

Run `npm run dev` to start the dev server at `http://localhost:3000`
