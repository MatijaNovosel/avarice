import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../providers/services/user.service";
import { UsersController } from "../controllers/user.controller";
import { Appuser } from "../entities/appuser";

@Module({
  imports: [TypeOrmModule.forFeature([Appuser])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
