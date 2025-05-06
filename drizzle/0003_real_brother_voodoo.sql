ALTER TABLE "courses" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "courses"."subject"), 'A') ||
          setweight(to_tsvector('english', "courses"."course_number"), 'A') ||
          setweight(to_tsvector('english', "courses"."title"), 'B') ||
          setweight(to_tsvector('english', "courses"."semester"), 'C')) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "professors" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "professors"."name"), 'A') ||
          setweight(to_tsvector('english', "professors"."department"), 'B')) STORED NOT NULL;