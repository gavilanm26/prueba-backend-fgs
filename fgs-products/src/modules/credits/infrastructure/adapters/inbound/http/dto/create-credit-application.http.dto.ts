import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateCreditApplicationHttpDto {
    @IsString()
    @IsNotEmpty()
    readonly customerId: string;

    @IsString()
    @IsNotEmpty()
    readonly purpose: string;

    @IsNumber()
    @Min(0)
    readonly amount: number;

    @IsNumber()
    @Min(0)
    readonly term: number;
}
