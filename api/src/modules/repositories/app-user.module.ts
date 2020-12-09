import { Appuser } from "./../../entities/appuser";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Appuser])],
  exports: [TypeOrmModule]
})
export class AppUserModule {}
