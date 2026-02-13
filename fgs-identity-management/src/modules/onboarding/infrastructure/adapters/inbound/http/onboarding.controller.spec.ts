import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { CreateOnboardingUseCase } from '../../../../application/use-cases/create-onboarding.usecase';

describe('OnboardingController', () => {
    let controller: OnboardingController;
    let useCase: CreateOnboardingUseCase;

    beforeEach(async () => {
        const mockUseCase = {
            execute: jest.fn().mockResolvedValue({ onboardingId: 'uuid', status: 'REQUESTED' }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [OnboardingController],
            providers: [
                {
                    provide: CreateOnboardingUseCase,
                    useValue: mockUseCase,
                },
            ],
        })
            .compile();

        controller = module.get<OnboardingController>(OnboardingController);
        useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call execute on the use case', async () => {
        const dto = {
            name: 'JohnDoe',
            username: 'johndoe',
            document: 12345678,
            email: 'john@example.com',
            amount: 1000,
            password: 'password123',
        };

        const result = await controller.create(dto);

        expect(result).toEqual({ onboardingId: 'uuid', status: 'REQUESTED' });
        expect(useCase.execute).toHaveBeenCalledWith(dto);
    });
});
