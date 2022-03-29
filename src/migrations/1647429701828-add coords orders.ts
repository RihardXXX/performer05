import {MigrationInterface, QueryRunner} from "typeorm";

export class addCoordsOrders1647429701828 implements MigrationInterface {
    name = 'addCoordsOrders1647429701828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "coords" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "coords"`);
    }

}
