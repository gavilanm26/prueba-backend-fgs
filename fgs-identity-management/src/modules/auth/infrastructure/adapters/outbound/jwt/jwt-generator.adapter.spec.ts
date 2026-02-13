import { Test, TestingModule } from '@nestjs/testing';
import { JwtGeneratorAdapter } from './jwt-generator.adapter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../../../domain/value-objects/token-payload.vo';

// Mock de Crypto. Importante usar el mismo patrón de importación que en el adaptador.
jest.mock('../../../../../../commons/cryto/cryto', () => {
    return {
        __esModule: true,
        default: {
            encrypt: jest.fn().mockReturnValue('mocked_encrypted_data'),
        }
    };
});

describe('JwtGeneratorAdapter', () => {
    let adapter: JwtGeneratorAdapter;
    let jwtService: JwtService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtGeneratorAdapter,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        adapter = module.get<JwtGeneratorAdapter>(JwtGeneratorAdapter);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('generate', () => {
        it('should generate a jwt token with the correct payload', async () => {
            const payload = new TokenPayload('user-123', 'testuser');
            const mockToken = 'signed_jwt_token';
            const mockExpiresIn = '3600';

            jest.spyOn(configService, 'get').mockReturnValue(mockExpiresIn);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

            const result = await adapter.generate(payload);

            expect(jwtService.signAsync).toHaveBeenCalledWith({ data: 'mocked_encrypted_data' });
            expect(result.accessToken).toBe(mockToken);
            expect(result.expiresIn).toBe(Number(mockExpiresIn));
        });

        it('should use default expiresIn if not provided in config', async () => {
            const payload = new TokenPayload('user-123', 'testuser');
            const mockToken = 'signed_jwt_token';

            jest.spyOn(configService, 'get').mockReturnValue(undefined);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

            const result = await adapter.generate(payload);

            expect(result.expiresIn).toBe(3600);
        });
    });
});
