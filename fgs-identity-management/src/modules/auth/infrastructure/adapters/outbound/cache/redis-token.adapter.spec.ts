import { Test, TestingModule } from '@nestjs/testing';
import { RedisTokenAdapter } from './redis-token.adapter';
import { of } from 'rxjs';

// Mock de internalLogger para que no dependa de la implementación real en los tests
jest.mock('../../../../../../commons/http-logger/httpLogger', () => ({
    internalLogger: () => (source: any) => source,
}));

describe('RedisTokenAdapter', () => {
    let adapter: RedisTokenAdapter;
    let redisClient: any;

    beforeEach(async () => {
        redisClient = {
            set: jest.fn(),
            get: jest.fn(),
            ttl: jest.fn(),
            pipeline: jest.fn().mockReturnValue({
                get: jest.fn().mockReturnThis(),
                ttl: jest.fn().mockReturnThis(),
                exec: jest.fn(),
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisTokenAdapter,
                {
                    provide: 'REDIS_CLIENT',
                    useValue: redisClient,
                },
            ],
        }).compile();

        adapter = module.get<RedisTokenAdapter>(RedisTokenAdapter);
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('save', () => {
        it('should save a value to redis with TTL', async () => {
            const key = 'test_key';
            const value = 'test_value';
            const ttl = 3600;

            redisClient.set.mockResolvedValue('OK');

            await adapter.save(key, value, ttl);

            expect(redisClient.set).toHaveBeenCalledWith(key, value, 'EX', ttl);
        });
    });

    describe('get', () => {
        it('should retrieve a value and ttl using pipeline', async () => {
            const key = 'test_key';
            const mockValue = 'test_value';
            const mockTtl = 3600;

            const pipelineMock = redisClient.pipeline();
            pipelineMock.exec.mockResolvedValue([
                [null, mockValue],
                [null, mockTtl],
            ]);

            const result: any = await adapter.get(key);

            expect(redisClient.pipeline).toHaveBeenCalled();
            expect(pipelineMock.get).toHaveBeenCalledWith(key);
            expect(pipelineMock.ttl).toHaveBeenCalledWith(key);

            // El adaptador devuelve { result: { value, ttl } } debido al mapeo interno para el logger
            expect(result.result).toEqual({ value: mockValue, ttl: mockTtl });
        });

        it('should return null and -2 if results are null', async () => {
            const key = 'test_key';
            const pipelineMock = redisClient.pipeline();
            pipelineMock.exec.mockResolvedValue(null);

            const result: any = await adapter.get(key);

            expect(result.result).toEqual({ value: null, ttl: -2 });
        });
    });
});
