import {MigrationInterface, QueryRunner} from "typeorm";

export class addBlackList1643443878105 implements MigrationInterface {
    name = 'addBlackList1643443878105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "blackList" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "blackList" SET DEFAULT '[]'`);
    }

}
