import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { GenerateTokenUseCase } from '../../../../application/use-cases/generate-token.usecase';
import { GenerateTokenHttpDto } from './dto/generate-token.http.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let useCase: GenerateTokenUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: GenerateTokenUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        useCase = module.get<GenerateTokenUseCase>(GenerateTokenUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should call GenerateTokenUseCase.execute and return the result', async () => {
            const dto: GenerateTokenHttpDto = {
                username: 'admin',
                password: 'password123',
            };
            const expectedResult = {
                accessToken: 'mocked_token',
                expiresIn: 3600,
            };

            jest.spyOn(useCase, 'execute').mockResolvedValue(expectedResult);

            const result = await controller.login(dto);

            expect(useCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });
    });
});
