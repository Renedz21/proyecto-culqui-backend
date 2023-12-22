import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateExchangeRateDto } from './dto/update-exhange-rate.dto';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

@Injectable()
export class ExchangeRateService {

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  private async getExchangeRate(name: string) {
    const supportedCurrencies = ['dolar', 'euro', 'libra'];
    const currencyRate = await this.cacheManager.get(`${name.toLowerCase()}Rate`);

    if (!supportedCurrencies.includes(name.toLowerCase())) {
      throw new BadRequestException('Moneda no soportada');
    }

    return {
      message: 'Tasa de cambio obtenida con éxito',
      data: {
        name,
        value: currencyRate
      }
    };
  }

  async calculateExchangeRate(createExchangeRate: CreateExchangeRateDto) {
    try {
      const { moneda_destino, moneda_origen, monto } = createExchangeRate;

      if (!moneda_origen || !moneda_destino || !monto) {
        throw new BadRequestException('Faltan datos para realizar la operación');
      }

      const exchangeRate = await this.getExchangeRate(moneda_destino);
      const exhangeRateValue = exchangeRate.data.value as number;

      if (!exhangeRateValue) {
        throw new BadRequestException('No se ha configurado la tasa de cambio');
      }

      const monto_con_tipo_de_cambio = monto * exhangeRateValue;

      return {
        message: 'Operación realizada con éxito',
        data: {
          ...createExchangeRate,
          tipo_de_cambio: exhangeRateValue,
          monto_con_tipo_de_cambio,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('No se ha configurado la tasa de cambio');
    }
  }

  async updateExchangeRate(updateExchangeRate: UpdateExchangeRateDto) {
    await this.cacheManager.del('exchangeRate');
    const { moneda_origen, valor } = updateExchangeRate;

    if (!moneda_origen || !valor) {
      throw new BadRequestException('Faltan datos para realizar la operación');
    }

    const supportedCurrencies = ['dolar', 'euro', 'libra'];
    const lowerCaseMonedaOrigen = moneda_origen.toLowerCase();

    if (!supportedCurrencies.includes(lowerCaseMonedaOrigen)) {
      throw new BadRequestException('Moneda no soportada. Solo soporta Dolar, Euro y Libras');
    }

    await this.cacheManager.set(`${lowerCaseMonedaOrigen}Rate`, valor);

    return {
      message: 'Tasa de cambio actualizada con éxito',
      data: {
        moneda_origen,
        valor
      }
    };
  }

}
