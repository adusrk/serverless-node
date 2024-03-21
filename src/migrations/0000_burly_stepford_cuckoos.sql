CREATE TABLE IF NOT EXISTS "leads" (
	"email" text,
	"created_at" timestamp DEFAULT now(),
	"id" serial PRIMARY KEY NOT NULL
);
