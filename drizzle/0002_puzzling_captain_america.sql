ALTER TABLE "courses" ALTER COLUMN "course_number" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "semester" text NOT NULL;