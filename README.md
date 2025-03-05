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

2. `cp .env.example .env`

Only run the following steps after completing the tutorial in the wiki

4. `npm run db:start`
5. `npm run db:generate` (This command is only needed when database schema changes are made)
6. `npm run db:migrate`
7. `npm run db:seed`

Run `npm run db:studio` to access the database at `http://local.drizzle.studio`

### Running the dev server
1. `npm install`

Run `npm run dev` to start the dev server at `http://localhost:3000`

# Spartan Compass

## Setup
1. `npm install`
2. `cp .env.example .env`
4. `npm run db:start`
6. `npm run db:migrate`
7. `npm run db:seed`

Run `npm run dev` to start the dev server at `http://localhost:3000`

Run `npm run db:studio` to access the database at `http://local.drizzle.studio`
