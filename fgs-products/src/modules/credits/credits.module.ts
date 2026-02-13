import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditsController } from './infrastructure/adapters/inbound/http/credits.controller';
import { CreateCreditApplicationUseCase } from './application/use-cases/create-credit-application.usecase';
import { GetCreditApplicationsUseCase } from './application/use-cases/get-credit-applications.usecase';
import { GetCreditApplicationByCustomerIdUseCase } from './application/use-cases/get-credit-application-by-id.usecase';
import { CREDIT_APPLICATION_REPOSITORY_PORT } from './domain/ports/credit-application.repository.port';
import { MongoCreditApplicationRepositoryAdapter } from './infrastructure/adapters/outbound/repositories/mongo-credit-application.repository.impl';
import {
    CreditApplicationDocument,
    CreditApplicationSchema,
} from './infrastructure/persistence/schemas/credit-application.schema';
import { CreditsTokenGuard } from './infrastructure/adapters/inbound/http/guards/credits-token.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CreditApplicationDocument.name, schema: CreditApplicationSchema },
        ]),
    ],
    controllers: [CreditsController],
    providers: [
        CreateCreditApplicationUseCase,
        GetCreditApplicationsUseCase,
        GetCreditApplicationByCustomerIdUseCase,
        CreditsTokenGuard,
        {
            provide: CREDIT_APPLICATION_REPOSITORY_PORT,
            useClass: MongoCreditApplicationRepositoryAdapter,
        },
    ],
    exports: [CreateCreditApplicationUseCase, GetCreditApplicationsUseCase],
})
export class CreditsModule { }
