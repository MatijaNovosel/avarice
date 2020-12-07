import { Scalar, CustomScalar } from "@nestjs/graphql";

@Scalar("Void")
export class VoidScalar implements CustomScalar<null, null> {
  name: "Void";
  description = "Represents no return value.";

  parseValue() {
    return null;
  }

  serialize() {
    return null;
  }

  parseLiteral() {
    return null;
  }
}
