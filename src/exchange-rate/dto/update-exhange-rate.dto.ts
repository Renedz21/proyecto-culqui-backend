import { IsNumber, IsString } from 'class-validator'

export class UpdateExchangeRateDto {
    @IsString()
    moneda_origen: string;

    @IsNumber()
    valor: number;
}
