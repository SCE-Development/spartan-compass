ALTER TABLE "professors" ADD COLUMN "rmp_id" text;--> statement-breakpoint
ALTER TABLE "professors" ADD COLUMN "rmp_legacy_id" integer;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "rmp_id" text;