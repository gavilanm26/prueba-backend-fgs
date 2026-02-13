import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './infrastructure/persistence/schemas/user.schema';

describe('AuthModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        const redisMock = {
            get: jest.fn(),
            set: jest.fn(),
            pipeline: jest.fn(),
        };

        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                JwtModule.register({ secret: 'test' }),
                AuthModule
            ],
        })
            .overrideProvider('REDIS_CLIENT')
            .useValue(redisMock)
            .overrideProvider(getModelToken(User.name))
            .useValue({})
            .compile();
    });

    it('should be defined', () => {
        const authModule = module.get<AuthModule>(AuthModule);
        expect(authModule).toBeDefined();
    });
});
