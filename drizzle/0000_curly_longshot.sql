CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"semester" text NOT NULL,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"course_number" text NOT NULL,
	"class_number" text NOT NULL,
	"units" text NOT NULL,
	"type" text NOT NULL,
	"days" text NOT NULL,
	"time" text NOT NULL,
	"location" text NOT NULL,
	"dates" text NOT NULL,
	"open_seats" text NOT NULL,
	"description" text,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "courses"."subject"), 'A') ||
          setweight(to_tsvector('english', "courses"."course_number"), 'A') ||
          setweight(to_tsvector('english', "courses"."class_number"), 'B') ||
          setweight(to_tsvector('english', "courses"."title"), 'C') ||
          setweight(to_tsvector('english', "courses"."units"), 'D') ||
          setweight(to_tsvector('english', "courses"."type"), 'E') ||
          setweight(to_tsvector('english', "courses"."days"), 'F') ||
          setweight(to_tsvector('english', "courses"."time"), 'G') ||
          setweight(to_tsvector('english', "courses"."location"), 'H') ||
          setweight(to_tsvector('english', "courses"."dates"), 'I') ||
          setweight(to_tsvector('english', "courses"."open_seats"), 'J') ||
          setweight(to_tsvector('english', "courses"."semester"), 'K')) STORED NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professors_courses" (
	"professor_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	CONSTRAINT "professors_courses_professor_id_course_id_pk" PRIMARY KEY("professor_id","course_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"department" text NOT NULL,
	"avg_rating" real,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "professors"."name"), 'A') ||
          setweight(to_tsvector('english', "professors"."department"), 'B')) STORED NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"course_id" integer NOT NULL,
	"professor_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"google_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professors_courses" ADD CONSTRAINT "professors_courses_professor_id_professors_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professors_courses" ADD CONSTRAINT "professors_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_professor_id_professors_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;