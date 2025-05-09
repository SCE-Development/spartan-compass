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
3. `bun run db:start`
4. `bun run db:generate` (This command is only needed when database schema changes are made)
5. `bun run db:migrate`
6. `bun run db:seed`

Run `bun run db:studio` to access the database at `http://local.drizzle.studio`

> [!WARNING]
> If you need to, never delete the files themselves as this will mess with Drizzle. You should instead run:
>
> ```sh
> bun run db:drop
> ```

### Running the dev server

1. `bun install`

Run `bun dev` to start the dev server at `http://localhost:3000`

## Running in Production (Docker)

The [production compose file](docker/compose.prod.yml) consists of the following parts ran in this order:

1. db - postgres container
2. migrator - runs drizzle migrator and can be manually used to scrape data
3. app - the actual app container that runs nextjs

To start:

```shell
docker compose up docker/compose.prod.yml
```

To manually run the scraper once:

```shell
docker compose -f docker/compose.prod.yml run migrator bun run db:insert:bun
```

### Env Setup

For reference, see [.env.example](.env.example)

Production requires the following changes:

- `DATABASE_URL` needs to be set to the postgres container instead of localhost
- `ORIGIN` needs to be set to `https://{domain}`
