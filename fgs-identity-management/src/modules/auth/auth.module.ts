import { Module } from '@nestjs/common';
import { GenerateTokenUseCase } from './application/use-cases/generate-token.usecase';
import { AuthController } from './infrastructure/adapters/inbound/http/auth.controller';
import { TOKEN_REPOSITORY_PORT, JWT_GENERATOR_PORT, TOKEN_CACHE_PORT } from './domain/ports';
import { MongoTokenRepository } from './infrastructure/adapters/outbound/repositories/mongo-token.repository.impl';
import { JwtGeneratorAdapter } from './infrastructure/adapters/outbound/jwt/jwt-generator.adapter';
import { RedisTokenAdapter } from './infrastructure/adapters/outbound/cache/redis-token.adapter';
import { redisConfig } from './infrastructure/config/redis.config';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './infrastructure/config/jwt.config';

import { JwtModule } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/persistence/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      load: [jwtConfig, redisConfig],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          expiresIn: configService.get<any>('jwt.expiresIn'),
          algorithm: configService.get<Algorithm>('jwt.algorithm'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    GenerateTokenUseCase,
    {
      provide: TOKEN_REPOSITORY_PORT,
      useClass: MongoTokenRepository,
    },
    {
      provide: JWT_GENERATOR_PORT,
      useClass: JwtGeneratorAdapter,
    },
    {
      provide: TOKEN_CACHE_PORT,
      useClass: RedisTokenAdapter,
    },
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('redis.host');
        const port = configService.get<number>('redis.port');
        const password = configService.get<string>('redis.password');

        return new Redis({
          host,
          port,
          password,
        });
      },
    },
  ],
})
export class AuthModule { }