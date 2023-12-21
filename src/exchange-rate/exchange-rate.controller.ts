import { Controller, Post, Body } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exhange-rate.dto';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) { }

  @Post('/calculate')
  async createExchangeRate(@Body() body: CreateExchangeRateDto) {
    return await this.exchangeRateService.calculateExchangeRate(body);
  }

  @Post('/update')
  async updateExchangeRate(@Body() updateExchangeRateDto: UpdateExchangeRateDto) {
    return await this.exchangeRateService.updateExchangeRate(updateExchangeRateDto);
  }
}
