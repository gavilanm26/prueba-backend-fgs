import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreditApplicationOutputDto } from '../dto/credit-application.output.dto';
import { CREDIT_APPLICATION_REPOSITORY_PORT } from '../../domain/ports/credit-application.repository.port';
import type { CreditApplicationRepositoryPort } from '../../domain/ports/credit-application.repository.port';

@Injectable()
export class GetCreditApplicationByCustomerIdUseCase {
    constructor(
        @Inject(CREDIT_APPLICATION_REPOSITORY_PORT)
        private readonly repository: CreditApplicationRepositoryPort,
    ) { }

    async execute(customerId: string): Promise<CreditApplicationOutputDto> {
        const app = await this.repository.findByCustomerId(customerId);

        if (!app) {
            throw new NotFoundException(`Credit application for customer ${customerId} not found`);
        }

        return new CreditApplicationOutputDto(
            app.id,
            app.customerId,
            app.purpose,
            app.amount,
            app.term,
            app.status,
        );
    }
}
