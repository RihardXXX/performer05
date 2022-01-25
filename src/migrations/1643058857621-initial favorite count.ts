import {MigrationInterface, QueryRunner} from "typeorm";

export class initialFavoriteCount1643058857621 implements MigrationInterface {
    name = 'initialFavoriteCount1643058857621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "favoritesCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "favoritesCount"`);
    }

}
