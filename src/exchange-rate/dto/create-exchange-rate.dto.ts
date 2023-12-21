import { IsNumber, IsString } from 'class-validator'

export class CreateExchangeRateDto {

    @IsNumber()
    monto: number;

    @IsString()
    moneda_origen: string;

    @IsString()
    moneda_destino: string;
}
