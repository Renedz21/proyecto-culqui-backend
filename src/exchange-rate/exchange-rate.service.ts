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
    try {
      const dolarRate: any = await this.cacheManager.get('dolarRate');
      const euroRate: any = await this.cacheManager.get('euroRate');
      const solesRate: any = await this.cacheManager.get('solesRate');

      if (name.toLowerCase() === 'dolar') {
        return {
          message: 'Tasa de cambio obtenida con éxito',
          data: {
            name,
            value: dolarRate
          }
        }
      } else if (name.toLowerCase() === 'euro') {
        return {
          message: 'Tasa de cambio obtenida con éxito',
          data: {
            name,
            value: euroRate
          }
        }
      } else if (name.toLowerCase() === 'soles') {
        return {
          message: 'Tasa de cambio obtenida con éxito',
          data: {
            name,
            value: solesRate
          }
        }
      } else {
        throw new BadRequestException('Moneda no soportada');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async calculateExchangeRate(createExchangeRate: CreateExchangeRateDto) {
    try {

      const { moneda_destino, moneda_origen, monto } = createExchangeRate;

      if (!moneda_origen || !moneda_destino || !monto) throw new BadRequestException('Faltan datos para realizar la operación');

      const exchangeRate = await this.getExchangeRate(moneda_origen);
      const exhangeRateValue = exchangeRate.data.value
      if (!exhangeRateValue) throw new BadRequestException('No se ha configurado la tasa de cambio');

      const result = monto * exhangeRateValue; //monto con tipo de cambio

      return {
        message: 'Operación realizada con éxito',
        data: {
          ...createExchangeRate,
          tipo_de_cambio: exhangeRateValue,
          monto_con_tipo_de_cambio: result,
        }
      }

    } catch (error) {
      console.log(error);
      throw new BadRequestException('No se ha configurado la tasa de cambio');
    }
  }

  async updateExchangeRate(updateExchangeRate: UpdateExchangeRateDto) {
    await this.cacheManager.del('exchangeRate');
    const { moneda_origen, valor } = updateExchangeRate;

    if (!moneda_origen || !valor) throw new BadRequestException('Faltan datos para realizar la operación');

    if (moneda_origen.toLowerCase() !== 'dolar' && moneda_origen.toLowerCase() !== 'euro' && moneda_origen.toLowerCase() !== 'soles') throw new BadRequestException('Moneda no soportada. Solo soporta Dolar, Euro y Soles');

    await this.cacheManager.set(`${moneda_origen.toLowerCase()}Rate`, valor);

    return {
      message: 'Tasa de cambio actualizada con éxito',
      data: {
        moneda_origen,
        valor
      }
    }
  }

}
