import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

type JwtHeader = {
  alg?: string;
  typ?: string;
};

type JwtPayload = {
  exp?: number;
  iat?: number;
  data?: string;
  [key: string]: unknown;
};

type TokenUser = {
  sub: string;
  username: string;
};

@Injectable()
export class CreditsTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: TokenUser;
    }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const jwtPublicKeyBase64 = this.configService.get<string>('JWT_PUBLIC_KEY');
    const jwtKey = this.configService.get<string>('JWT_KEY');

    if (!jwtPublicKeyBase64 || !jwtKey) {
      throw new UnauthorizedException('Token validation is not configured');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = this.verifyToken(token, jwtPublicKeyBase64);
    const decryptedPayload = this.decryptPayload(payload.data, jwtKey);

    if (!decryptedPayload?.sub || !decryptedPayload?.username) {
      throw new UnauthorizedException('Invalid token payload');
    }

    request.user = {
      sub: decryptedPayload.sub,
      username: decryptedPayload.username,
    };

    return true;
  }

  private verifyToken(token: string, jwtPublicKeyBase64: string): JwtPayload {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new UnauthorizedException('Invalid token');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = tokenParts;
    const header = this.parseJwtSection<JwtHeader>(encodedHeader);
    const payload = this.parseJwtSection<JwtPayload>(encodedPayload);

    if (header.alg !== 'RS256') {
      throw new UnauthorizedException('Invalid token algorithm');
    }

    if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    const publicKey = Buffer.from(jwtPublicKeyBase64, 'base64').toString('utf8');
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${encodedHeader}.${encodedPayload}`);
    verifier.end();

    const signature = this.base64UrlToBuffer(encodedSignature);
    const isValidSignature = verifier.verify(publicKey, signature);

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  private parseJwtSection<T>(value: string): T {
    try {
      const decoded = this.base64UrlToBuffer(value).toString('utf8');
      return JSON.parse(decoded) as T;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private base64UrlToBuffer(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return Buffer.from(padded, 'base64');
  }

  private decryptPayload(encryptedPayload: unknown, jwtKey: string): TokenUser {
    if (typeof encryptedPayload !== 'string') {
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      const parts = encryptedPayload.split(':');
      if (parts.length < 3) {
        throw new Error('Invalid encrypted payload format');
      }

      const keyHex = this.getKeyHex(jwtKey);
      const key = Buffer.from(keyHex, 'hex');

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedData = parts.slice(2).join(':');

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted) as TokenUser;
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }
  }

  private getKeyHex(key: string): string {
    const repeatedKey = key.repeat(Math.ceil(32 / key.length)).slice(0, 32);
    const hexKey = Buffer.from(repeatedKey).toString('hex');
    return hexKey.padEnd(64, '0');
  }
}
