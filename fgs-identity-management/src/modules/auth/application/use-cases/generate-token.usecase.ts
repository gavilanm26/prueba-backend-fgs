import { Inject, Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { GenerateTokenInputDto } from '../dto/generate-token.input.dto';
import { GenerateTokenOutputDto } from '../dto/generate-token.output.dto';
import {
  TOKEN_REPOSITORY_PORT,
  JWT_GENERATOR_PORT,
  TOKEN_CACHE_PORT,
} from '../../domain/ports';
import type {
  TokenRepositoryPort,
  JwtGeneratorPort,
  TokenCachePort,
} from '../../domain/ports';
import { TokenPayload } from '../../domain/value-objects/token-payload.vo';

@Injectable()
export class GenerateTokenUseCase {
  private readonly logger = new Logger(GenerateTokenUseCase.name);

  constructor(
    @Inject(TOKEN_REPOSITORY_PORT)
    private readonly repository: TokenRepositoryPort,

    @Inject(JWT_GENERATOR_PORT)
    private readonly jwtGenerator: JwtGeneratorPort,

    @Inject(TOKEN_CACHE_PORT)
    private readonly cache: TokenCachePort,
  ) { }

  async execute(input: GenerateTokenInputDto): Promise<GenerateTokenOutputDto> {
    const user = await this.repository.validateUser(input.username, input.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const cacheKey = `token:${input.username}`;
    const cached = await this.cache.get(cacheKey);

    if (cached.value) {
      this.logger.log(`Token reutilizado del cache para el usuario: ${input.username}`);
      return {
        accessToken: cached.value,
        expiresIn: cached.ttl > 0 ? cached.ttl : 3600,
      };
    }

    const payload = new TokenPayload(user.userId, input.username);

    const token = await this.jwtGenerator.generate(payload);

    await this.cache.save(cacheKey, token.accessToken, token.expiresIn);

    this.logger.log(`Token generado y persistido en cache exitosamente para el usuario: ${input.username}`);

    return {
      accessToken: token.accessToken,
      expiresIn: token.expiresIn,
    };
  }
}