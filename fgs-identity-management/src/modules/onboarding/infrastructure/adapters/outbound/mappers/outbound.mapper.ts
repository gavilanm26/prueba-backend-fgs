import { Onboarding, OnboardingStatus } from '../../../../domain/entities/onboarding.entity';
import { OnboardingSchema } from '../../../persistence/schemas/onboarding.schema';

export class OnboardingOutboundMapper {
    static toDomain(schema: OnboardingSchema): Onboarding {
        return new Onboarding(
            schema.id,
            schema.name,
            schema.username,
            schema.document,
            schema.email,
            schema.amount,
            schema.password,
            schema.status as OnboardingStatus,
            (schema as any).createdAt,
        );
    }

    static toPersistence(domain: Onboarding): Partial<OnboardingSchema> {
        return {
            id: domain.id,
            name: domain.name,
            document: domain.document,
            email: domain.email,
            amount: domain.amount,
            password: domain.password,
            status: domain.status,
            username: domain.username,
        };
    }
}
