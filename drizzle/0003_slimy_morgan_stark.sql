CREATE TABLE "user_phone_numbers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone_number" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL
);

ALTER TABLE "user" ADD COLUMN "id_card_number" text;
ALTER TABLE "user" ADD COLUMN "location_plan" text;
ALTER TABLE "user" ADD COLUMN "photo_path" text;
ALTER TABLE "user" ADD COLUMN "default_password" text;
ALTER TABLE "user_phone_numbers" ADD CONSTRAINT "user_phone_numbers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user" ADD CONSTRAINT "user_id_card_number_unique" UNIQUE("id_card_number");