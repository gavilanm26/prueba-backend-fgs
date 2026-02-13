import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOnboardingInputDto, CreateOnboardingOutputDto } from '../dto/create-onboarding.dto';
import { Onboarding, OnboardingStatus } from '../../domain/entities/onboarding.entity';
import { v4 as uuidv4 } from 'uuid';
import { ONBOARDING_REPOSITORY_PORT, type OnboardingRepositoryPort } from '../../domain/ports';

@Injectable()
export class CreateOnboardingUseCase {
    private readonly logger = new Logger(CreateOnboardingUseCase.name);

    constructor(
        @Inject(ONBOARDING_REPOSITORY_PORT)
        private readonly repository: OnboardingRepositoryPort,
    ) { }

    async execute(input: CreateOnboardingInputDto): Promise<CreateOnboardingOutputDto> {
        this.logger.log(`Iniciando creación de onboarding para: ${input.email}`);

        const existing = await this.repository.findByDocument(input.document.toString());
        if (existing) {
            throw new ConflictException(`El documento ${input.document} ya esta registrado`);
        }

        const existingUser = await this.repository.findByUsername(input.username);
        if (existingUser) {
            throw new ConflictException(`El usuario ${input.username} ya esta registrado`);
        }

        const onboarding = new Onboarding(
            uuidv4(),
            input.name,
            input.username,
            input.document.toString(),
            input.email,
            input.amount,
            input.password,
            OnboardingStatus.REQUESTED,
        );

        const saved = await this.repository.save(onboarding);

        return {
            onboardingId: saved.id,
            status: saved.status,
        };
    }
}
