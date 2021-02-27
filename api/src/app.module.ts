import { PaymentSourceHttpModule } from "./modules/http/payment-source-http.module";
import { FinancialHistoryHttpModule } from "./modules/http/financial-history-http.module";
import { AuthModule } from "./auth/auth.module";
import { AppUserHttpModule } from "./modules/http/app-user-http.module";
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
import { Locale } from "./entities/locale";

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
        Tag,
        Locale
      ],
      synchronize: false
    }),
    TagHttpModule,
    FinancialChangeHttpModule,
    AppSettingHttpModule,
    AppUserHttpModule,
    AuthModule,
    FinancialHistoryHttpModule,
    PaymentSourceHttpModule
  ],
  providers: [VoidScalar]
})
export class AppModule {}
