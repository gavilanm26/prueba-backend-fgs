import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenHttpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}