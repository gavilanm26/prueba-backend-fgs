import { CreditApplication } from "../entities/credit-application.entity";

export const CREDIT_APPLICATION_REPOSITORY_PORT = 'CREDIT_APPLICATION_REPOSITORY_PORT';

export interface CreditApplicationRepositoryPort {
    save(application: CreditApplication): Promise<CreditApplication>;
    findAll(customerId?: string): Promise<CreditApplication[]>;
    findByCustomerId(customerId: string): Promise<CreditApplication | null>;
}
