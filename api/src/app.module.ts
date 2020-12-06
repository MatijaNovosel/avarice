import { FinancialChangeModule } from "./modules/financial-change.module";
import { Tag } from "./entities/tag";
import { Paymentsource } from "./entities/paymentsource";
import { Financialhistory } from "./entities/financialhistory";
import { Financialchangetag } from "./entities/financialchangetag";
import { Financialchange } from "./entities/financialchange";
import { Appusersetting } from "./entities/appusersetting";
import { Appuser } from "./entities/appuser";
import { Appsetting } from "./entities/appsetting";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import serverConfig from "./config/server-config.json";
import { UsersModule } from "./modules/users.module";

const { host, port, username, password, database } = { ...serverConfig };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host,
      port,
      username,
      password,
      database,
      entities: [
        Appsetting,
        Appuser,
        Appusersetting,
        Financialchange,
        Financialchangetag,
        Financialhistory,
        Paymentsource,
        Tag
      ],
      synchronize: true
    }),
    UsersModule,
    FinancialChangeModule
  ]
})
export class AppModule {}
