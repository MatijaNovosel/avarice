import { Paymentsource } from 'src/entities/paymentsource';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Paymentsource])],
  exports: [TypeOrmModule]
})
export class PaymentSourceModule {}
