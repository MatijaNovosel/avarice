import { PaymentSourceHttpModule } from "./modules/http/payment-source-http.module";
import { FinancialHistoryHttpModule } from "./modules/http/financial-history-http.module";
import { AuthModule } from "./auth/auth.module";
import { AppUserHttpModule } from "./modules/http/app-user-http.module";
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
import { FinancialChangeHttpModule } from "./modules/http/financial-change-http.module";
import { TagHttpModule } from "./modules/http/tag-http.module";
import { Locale } from "./entities/locale";

const { host, port, username, password, database } = { ...serverConfig };

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      useGlobalPrefix: true,
      context: ({ req }) => ({ req }),
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
