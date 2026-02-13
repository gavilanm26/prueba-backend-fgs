import { Body, Controller, Post } from '@nestjs/common';
import { GenerateTokenUseCase } from '../../../../application/use-cases/generate-token.usecase';
import { GenerateTokenHttpDto } from './dto/generate-token.http.dto';

@Controller('v1')
export class AuthController {
  constructor(private readonly useCase: GenerateTokenUseCase) { }

  @Post('auth')
  async login(@Body() body: GenerateTokenHttpDto) {
    return this.useCase.execute(body);
  }
}