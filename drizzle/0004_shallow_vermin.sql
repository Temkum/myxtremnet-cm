ALTER TABLE "user" ADD COLUMN "must_change_password" boolean DEFAULT true NOT NULL;
ALTER TABLE "user" DROP COLUMN "default_password";