import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenUseCase } from './generate-token.usecase';
import {
    TOKEN_REPOSITORY_PORT,
    JWT_GENERATOR_PORT,
    TOKEN_CACHE_PORT,
} from '../../domain/ports';
import { UnauthorizedException } from '@nestjs/common';

describe('GenerateTokenUseCase', () => {
    let useCase: GenerateTokenUseCase;
    let repository: any;
    let jwtGenerator: any;
    let cache: any;

    beforeEach(async () => {
        repository = {
            validateUser: jest.fn(),
        };
        jwtGenerator = {
            generate: jest.fn(),
        };
        cache = {
            get: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenerateTokenUseCase,
                {
                    provide: TOKEN_REPOSITORY_PORT,
                    useValue: repository,
                },
                {
                    provide: JWT_GENERATOR_PORT,
                    useValue: jwtGenerator,
                },
                {
                    provide: TOKEN_CACHE_PORT,
                    useValue: cache,
                },
            ],
        }).compile();

        useCase = module.get<GenerateTokenUseCase>(GenerateTokenUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
        repository.validateUser.mockResolvedValue(null);

        await expect(
            useCase.execute({ username: 'user', password: 'wrong_password' }),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should reuse token from cache if available', async () => {
        const username = 'admin';
        const cachedToken = 'cached_jwt_token';
        const cachedTtl = 1000;

        repository.validateUser.mockResolvedValue({ userId: '1', username });
        cache.get.mockResolvedValue({ value: cachedToken, ttl: cachedTtl });

        const result = await useCase.execute({ username, password: 'password' });

        expect(result.accessToken).toBe(cachedToken);
        expect(result.expiresIn).toBe(cachedTtl);
        expect(jwtGenerator.generate).not.toHaveBeenCalled();
    });

    it('should generate a new token if not in cache', async () => {
        const username = 'admin';
        const newAccessToken = 'new_jwt_token';
        const expiresIn = 3600;

        repository.validateUser.mockResolvedValue({ userId: '1', username });
        cache.get.mockResolvedValue({ value: null, ttl: -2 });
        jwtGenerator.generate.mockResolvedValue({ accessToken: newAccessToken, expiresIn });

        const result = await useCase.execute({ username, password: 'password' });

        expect(result.accessToken).toBe(newAccessToken);
        expect(result.expiresIn).toBe(expiresIn);
        expect(cache.save).toHaveBeenCalledWith(`token:${username}`, newAccessToken, expiresIn);
    });
});
