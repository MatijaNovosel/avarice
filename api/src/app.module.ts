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
import { GTagModule } from "./modules/tag.module";

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
    GTagModule
  ]
})
export class AppModule {}
