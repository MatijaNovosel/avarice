import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class AppSettingInputType {
  @Field({ nullable: true })
  public checkingGraphColor?: string;

  @Field({ nullable: true })
  public gyroGraphColor?: string;

  @Field({ nullable: true })
  public pocketGraphColor?: string;

  @Field({ nullable: true })
  public totalGraphColor?: string;

  @Field({ nullable: true })
  public gyroGraphVisible?: boolean;

  @Field({ nullable: true })
  public checkingGraphVisible?: boolean;

  @Field({ nullable: true })
  public pocketGraphVisible?: boolean;

  @Field({ nullable: true })
  public totalGraphVisible?: boolean;

  @Field(() => Int)
  public appUserId?: number;
}
