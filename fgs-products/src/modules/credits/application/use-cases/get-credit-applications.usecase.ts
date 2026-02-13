import { Inject, Injectable } from '@nestjs/common';
import { CreditApplicationOutputDto } from '../dto/credit-application.output.dto';
import { CREDIT_APPLICATION_REPOSITORY_PORT } from '../../domain/ports/credit-application.repository.port';
import type { CreditApplicationRepositoryPort } from '../../domain/ports/credit-application.repository.port';

@Injectable()
export class GetCreditApplicationsUseCase {
    constructor(
        @Inject(CREDIT_APPLICATION_REPOSITORY_PORT)
        private readonly repository: CreditApplicationRepositoryPort,
    ) { }

    async execute(customerId?: string): Promise<CreditApplicationOutputDto[]> {
        const applications = await this.repository.findAll(customerId);
        return applications.map(
            (app) =>
                new CreditApplicationOutputDto(
                    app.id,
                    app.customerId,
                    app.purpose,
                    app.amount,
                    app.term,
                    app.status,
                ),
        );
    }
}
