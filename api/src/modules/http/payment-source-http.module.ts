import { PaymentSourceService } from "./../../services/payment-source.service";
import { Module } from "@nestjs/common";
import { PaymentSourceResolver } from "../../resolvers/payment-source.resolver";
import { PaymentSourceModule } from "../repositories/payment-source.module";

@Module({
  imports: [PaymentSourceModule],
  providers: [PaymentSourceResolver, PaymentSourceService]
})
export class PaymentSourceHttpModule {}
