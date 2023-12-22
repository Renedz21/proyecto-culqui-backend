import { Controller, Post, Body } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exhange-rate.dto';
import { VALID_ROLES } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) { }

  @Post('/calculate')
  @Auth(VALID_ROLES.ADMIN_KEY, VALID_ROLES.CUSTOMER_KEY)
  async createExchangeRate(@Body() body: CreateExchangeRateDto) {
    return await this.exchangeRateService.calculateExchangeRate(body);
  }

  @Post('/update')
  @Auth(VALID_ROLES.ADMIN_KEY)
  async updateExchangeRate(@Body() updateExchangeRateDto: UpdateExchangeRateDto) {
    return await this.exchangeRateService.updateExchangeRate(updateExchangeRateDto);
  }
}
