import { AppSettingHttpModule } from "src/modules/http/app-setting-http.module";
import { Tag } from "src/entities/tag";
import { Paymentsource } from "src/entities/paymentsource";
import { Financialhistory } from "src/entities/financialhistory";
import { Financialchangetag } from "src/entities/financialchangetag";
import { Financialchange } from "src/entities/financialchange";
import { Appuser } from "src/entities/appuser";
import { Appsetting } from "src/entities/appsetting";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import serverConfig from "src/config/server-config.json";
import { GraphQLModule } from "@nestjs/graphql";
import { VoidScalar } from "src/scalars/void";
import { FinancialChangeHttpModule } from "src/modules/http/financial-change-http.module";
import { TagHttpModule } from "src/modules/http/tag-http.module";

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
