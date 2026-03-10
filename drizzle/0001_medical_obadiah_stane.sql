DELETE FROM verification WHERE id NOT IN (SELECT MIN(id) FROM verification GROUP BY identifier);

ALTER TABLE "verification" ADD CONSTRAINT "verification_identifier_unique" UNIQUE("identifier");