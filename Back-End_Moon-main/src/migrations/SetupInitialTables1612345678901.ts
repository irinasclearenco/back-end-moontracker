import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupInitialTables1612345678901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "symptom_category" (
                "id" SERIAL PRIMARY KEY,
                "name" varchar NOT NULL
            )`,
    );

    await queryRunner.query(
      `CREATE TABLE "symptom" (
                "id" SERIAL PRIMARY KEY,
                "description" varchar NOT NULL,
                "categoryId" integer,
                CONSTRAINT "FK_category" FOREIGN KEY ("categoryId") REFERENCES "symptom_category"("id")
            )`,
    );

    await queryRunner.query(
      `CREATE TABLE "moon_symptom" (
                "id" SERIAL PRIMARY KEY,
                "moonId" integer,
                "symptomId" integer,
                CONSTRAINT "FK_moon" FOREIGN KEY ("moonId") REFERENCES "moon"("id"),
                CONSTRAINT "FK_symptom" FOREIGN KEY ("symptomId") REFERENCES "symptom"("id")
            )`,
    );

    // Add similar statements for the 'moon' and 'user' tables.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "moon_symptom"`);
    await queryRunner.query(`DROP TABLE "symptom"`);
    await queryRunner.query(`DROP TABLE "symptom_category"`);
    // Include drop statements for the 'moon' and 'user' tables in reverse order.
  }
}
