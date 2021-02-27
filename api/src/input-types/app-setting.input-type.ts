import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class AppSettingInputType {
  @Field({ nullable: true })
  public dateFormat?: string;

  @Field({ nullable: true })
  public preferredCurrency?: string;

  @Field({ nullable: true })
  public localeId?: number;

  @Field({ nullable: true })
  public darkMode?: boolean;

  @Field(() => Int)
  @IsNotEmpty()
  public appUserId?: number;
}
