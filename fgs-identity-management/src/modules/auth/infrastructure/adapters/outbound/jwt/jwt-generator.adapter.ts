import { Injectable } from '@nestjs/common';
import { JwtGeneratorPort } from '../../../../domain/ports/jwt-generator.port';
import { TokenPayload } from '../../../../domain/value-objects/token-payload.vo';
import { Token } from '../../../../domain/entities/token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Crypto from '../../../../../../commons/cryto/cryto';

@Injectable()
export class JwtGeneratorAdapter implements JwtGeneratorPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async generate(payload: TokenPayload): Promise<Token> {
    const encryptedData = Crypto.encrypt({
      sub: payload.userId,
      username: payload.username
    });

    const accessToken = await this.jwtService.signAsync(
      { data: encryptedData },
    );

    const expiresInConfig = this.configService.get<string>('JWT_EXPIRES_IN') || '3600';
    const expiresIn = Number(expiresInConfig);

    return new Token(accessToken, expiresIn);
  }
}
