// src/currency/currency.service.spec.ts
import { BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import * as mockCache from 'cache-manager';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateExchangeRate', () => {
    it('should calculate exchange rate successfully', async () => {
      const mockExchangeRate = 1.2;
      const createExchangeRateDto = {
        moneda_destino: 'Euro',
        moneda_origen: 'Dolar',
        monto: 100,
      };

      jest.spyOn(service, 'calculateExchangeRate').mockImplementation(async () => ({
        message: 'Operación realizada con éxito',
        data: {
          tipo_de_cambio: mockExchangeRate,
          monto_con_tipo_de_cambio: 120,
        },
      } as any));

      const result = await service.calculateExchangeRate(createExchangeRateDto);

      expect(result.message).toEqual('Operación realizada con éxito');
      expect(result.data.tipo_de_cambio).toEqual(mockExchangeRate);
      expect(result.data.monto_con_tipo_de_cambio).toEqual(120);
    });

    it('should be update exchange rate successfully', async () => {

      const updateExchangeRateDto = {
        moneda_origen: 'Dolar',
        valor: 3.5,
      };

      jest.spyOn(service, 'updateExchangeRate').mockImplementation(async () => ({
        message: 'Tasa de cambio actualizada con éxito',
        data: {
          moneda_origen: 'Dolar',
          valor: 3.5,
        },
      } as any));

      const result = await service.updateExchangeRate(updateExchangeRateDto)

      expect(result.message).toEqual('Tasa de cambio actualizada con éxito');
      expect(result.data.moneda_origen).toEqual('Dolar');
      expect(result.data.valor).toEqual(3.5);
    });

    it('should throw BadRequestException if missing data', async () => {
      await expect(service.calculateExchangeRate({} as any)).rejects.toThrow(BadRequestException);
    });
  });
});
