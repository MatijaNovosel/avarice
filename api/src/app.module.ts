import { AppSettingHttpModule } from "./modules/http/app-setting-http.module";
import { Tag } from "./entities/tag";
import { Paymentsource } from "./entities/paymentsource";
import { Financialhistory } from "./entities/financialhistory";
import { Financialchangetag } from "./entities/financialchangetag";
import { Financialchange } from "./entities/financialchange";
import { Appuser } from "./entities/appuser";
import { Appsetting } from "./entities/appsetting";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import serverConfig from "./config/server-config.json";
import { GraphQLModule } from "@nestjs/graphql";
import { VoidScalar } from "./scalars/void";
import { FinancialChangeHttpModule } from "./modules/financial-change-http.module";
import { TagHttpModule } from "./modules/tag-http.module";

const { host, port, username, password, database } = { ...serverConfig };

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      autoSchemaFile: "schema.gql"
    }),
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
        Financialchange,
        Financialchangetag,
        Financialhistory,
        Paymentsource,
        Tag
      ],
      synchronize: true
    }),
    TagHttpModule,
    FinancialChangeHttpModule,
    AppSettingHttpModule
  ],
  providers: [VoidScalar]
})
export class AppModule {}
