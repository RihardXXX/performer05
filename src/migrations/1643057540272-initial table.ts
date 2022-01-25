import {MigrationInterface, QueryRunner} from "typeorm";

export class initialTable1643057540272 implements MigrationInterface {
    name = 'initialTable1643057540272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL DEFAULT '', "price" character varying NOT NULL DEFAULT '', "address" character varying NOT NULL, "category" text NOT NULL, "dueDate" character varying NOT NULL, "dueTime" character varying NOT NULL, "listOfPerformers" text NOT NULL, "selectedPerformer" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'свободен', "victory" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_favorites_orders" ("usersId" integer NOT NULL, "ordersId" integer NOT NULL, CONSTRAINT "PK_72eb8e3d29a75e6094a29f70c1d" PRIMARY KEY ("usersId", "ordersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_592ef9e62687e1bf44e8099e11" ON "users_favorites_orders" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8ff1647e70a518caac9445143e" ON "users_favorites_orders" ("ordersId") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_favorites_orders" ADD CONSTRAINT "FK_592ef9e62687e1bf44e8099e11a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorites_orders" ADD CONSTRAINT "FK_8ff1647e70a518caac9445143e7" FOREIGN KEY ("ordersId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorites_orders" DROP CONSTRAINT "FK_8ff1647e70a518caac9445143e7"`);
        await queryRunner.query(`ALTER TABLE "users_favorites_orders" DROP CONSTRAINT "FK_592ef9e62687e1bf44e8099e11a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ff1647e70a518caac9445143e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_592ef9e62687e1bf44e8099e11"`);
        await queryRunner.query(`DROP TABLE "users_favorites_orders"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
