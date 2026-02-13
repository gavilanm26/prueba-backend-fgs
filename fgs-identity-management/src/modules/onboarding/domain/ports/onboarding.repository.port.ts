import { Onboarding } from '../entities/onboarding.entity';

export const ONBOARDING_REPOSITORY_PORT = 'ONBOARDING_REPOSITORY_PORT';

export interface OnboardingRepositoryPort {
    save(onboarding: Onboarding): Promise<Onboarding>;
    findById(id: string): Promise<Onboarding | null>;
    findByDocument(document: string): Promise<Onboarding | null>;
    findByUsername(username: string): Promise<Onboarding | null>;
}
