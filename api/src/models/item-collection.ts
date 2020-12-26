import { GFinancialChange } from "./../entities/financialchange";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    items: T[];

    @Field(() => Int)
    count: number;
  }
  return PaginatedType;
}

@ObjectType()
export class PaginatedFinancialChange extends Paginated(GFinancialChange) {
  constructor(items: GFinancialChange[], count: number) {
    super();
    this.items = items;
    this.count = count;
  }
}
