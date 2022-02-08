import { Module } from "@nestjs/common";
import { ReviewsController } from "@app/reviews/reviews.controller";
import { ReviewsService } from "@app/reviews/reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsEntity } from "@app/reviews/reviews.entity";
import { UserEntity } from "@app/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewsEntity, UserEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
