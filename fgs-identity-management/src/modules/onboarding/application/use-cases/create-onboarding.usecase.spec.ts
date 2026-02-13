import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnboardingUseCase } from './create-onboarding.usecase';
import { ONBOARDING_REPOSITORY_PORT } from '../../domain/ports/onboarding.repository.port';
import { OnboardingStatus } from '../../domain/entities/onboarding.entity';

describe('CreateOnboardingUseCase', () => {
    let useCase: CreateOnboardingUseCase;
    let repository: any;

    beforeEach(async () => {
        repository = {
            save: jest.fn().mockImplementation((onboarding) => Promise.resolve(onboarding)),
            findByDocument: jest.fn().mockResolvedValue(null),
            findByUsername: jest.fn().mockResolvedValue(null),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateOnboardingUseCase,
                {
                    provide: ONBOARDING_REPOSITORY_PORT,
                    useValue: repository,
                },
            ],
        }).compile();

        useCase = module.get<CreateOnboardingUseCase>(CreateOnboardingUseCase);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should create an onboarding successfully', async () => {
        const input = {
            name: 'JohnDoe',
            username: 'johndoe',
            document: 12345678,
            email: 'john@example.com',
            amount: 1000,
            password: 'password123',
        };

        const result = await useCase.execute(input);

        expect(result).toBeDefined();
        expect(result.status).toBe(OnboardingStatus.REQUESTED);
        expect(repository.save).toHaveBeenCalled();
    });
});
