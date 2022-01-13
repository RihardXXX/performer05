import {MigrationInterface, QueryRunner} from "typeorm";

export class createOrdersTable1641995235459 implements MigrationInterface {
    name = 'createOrdersTable1641995235459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" (
            "id" SERIAL NOT NULL, 
            "slug" character varying NOT NULL, 
            "title" character varying NOT NULL, 
            "description" character varying NOT NULL, 
            "body" character varying NOT NULL DEFAULT '', 
            "price" character varying NOT NULL DEFAULT '', 
            "address" character varying NOT NULL, 
            "category" text NOT NULL, 
            "dueDate" character varying NOT NULL, 
            "dueTime" character varying NOT NULL, 
            "listOfPerformers" text NOT NULL, 
            "selectedPerformer" boolean NOT NULL DEFAULT false, 
            "status" character varying NOT NULL DEFAULT 'свободен', 
            "victory" integer, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
