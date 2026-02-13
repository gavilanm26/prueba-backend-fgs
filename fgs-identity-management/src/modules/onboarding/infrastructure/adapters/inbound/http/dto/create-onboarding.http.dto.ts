import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, MinLength, NotContains } from 'class-validator';

export class CreateOnboardingHttpDto {
    @IsString()
    @IsNotEmpty()
    @NotContains(' ', { message: 'El nombre no debe contener espacios' })
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNumber()
    @IsNotEmpty()
    document: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}
