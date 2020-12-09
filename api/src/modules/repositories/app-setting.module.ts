import { Appsetting } from "src/entities/appsetting";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Appsetting])],
  exports: [TypeOrmModule]
})
export class AppSettingModule {}
