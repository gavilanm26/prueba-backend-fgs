import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateOnboardingUseCase } from './application/use-cases/create-onboarding.usecase';
import { ONBOARDING_REPOSITORY_PORT } from './domain/ports/onboarding.repository.port';
import { OnboardingController } from './infrastructure/adapters/inbound/http/onboarding.controller';
import { MongoOnboardingRepository } from './infrastructure/adapters/outbound/repositories/mongo-onboarding.repository.impl';
import { OnboardingSchema, OnboardingSchemaDefinition } from './infrastructure/persistence/schemas/onboarding.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: OnboardingSchema.name, schema: OnboardingSchemaDefinition },
        ]),
        AuthModule,
    ],
    controllers: [OnboardingController],
    providers: [
        CreateOnboardingUseCase,
        {
            provide: ONBOARDING_REPOSITORY_PORT,
            useClass: MongoOnboardingRepository,
        },
    ],
    exports: [CreateOnboardingUseCase],
})
export class OnboardingModule { }
