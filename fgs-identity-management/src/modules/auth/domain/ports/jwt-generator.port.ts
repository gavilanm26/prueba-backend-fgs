import { TokenPayload } from '../value-objects/token-payload.vo';
import { Token } from '../entities/token.entity';

export const JWT_GENERATOR_PORT = 'JWT_GENERATOR_PORT';

export interface JwtGeneratorPort {
  generate(payload: TokenPayload): Promise<Token>;
}
