import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateController } from './exchange-rate.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ]
})
export class ExchangeRateModule { }
