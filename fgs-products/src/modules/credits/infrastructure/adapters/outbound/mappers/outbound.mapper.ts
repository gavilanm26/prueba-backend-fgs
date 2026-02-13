import { CreditApplication } from '../../../../domain/entities/credit-application.entity';
import { CreditApplicationDocument } from '../../../persistence/schemas/credit-application.schema';

export class OutboundMapper {
    static toDomain(document: CreditApplicationDocument): CreditApplication {
        return new CreditApplication(
            document._id.toString(),
            document.customerId,
            document.purpose,
            document.amount,
            document.term,
            document.status,
        );
    }

    static toDomainList(documents: CreditApplicationDocument[]): CreditApplication[] {
        return documents.map((doc) => this.toDomain(doc));
    }

    static toPersistence(application: CreditApplication): Partial<CreditApplicationDocument> {
        return {
            customerId: application.customerId,
            purpose: application.purpose,
            amount: application.amount,
            term: application.term,
            status: application.status,
        };
    }
}
