import {MigrationInterface, QueryRunner} from "typeorm";

export class addListFollows1645121089453 implements MigrationInterface {
    name = 'addListFollows1645121089453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "listIdFollows" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "listIdFollows"`);
    }

}
