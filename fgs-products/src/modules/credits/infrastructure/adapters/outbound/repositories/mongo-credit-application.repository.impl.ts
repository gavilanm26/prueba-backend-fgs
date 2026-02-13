import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditApplicationRepositoryPort } from '../../../../domain/ports/credit-application.repository.port';
import { CreditApplication } from '../../../../domain/entities/credit-application.entity';
import { CreditApplicationDocument } from '../../../persistence/schemas/credit-application.schema';
import { OutboundMapper } from '../mappers/outbound.mapper';

@Injectable()
export class MongoCreditApplicationRepositoryAdapter implements CreditApplicationRepositoryPort {
    private readonly logger = new Logger(MongoCreditApplicationRepositoryAdapter.name);

    constructor(
        @InjectModel(CreditApplicationDocument.name)
        private readonly model: Model<CreditApplicationDocument>,
    ) { }

    async save(application: CreditApplication): Promise<CreditApplication> {
        this.logger.log(`Saving credit application for customer: ${application.customerId}`);
        const startTime = Date.now();

        try {
            const persistenceModel = OutboundMapper.toPersistence(application);
            const createdApplication = new this.model(persistenceModel);
            const savedDoc = await createdApplication.save();
            const result = OutboundMapper.toDomain(savedDoc);

            const duration = Date.now() - startTime;
            this.logger.log(`Credit application saved successfully. ID: ${result.id}, Duration: ${duration}ms`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Failed to save credit application for customer: ${application.customerId}, Duration: ${duration}ms`, error.stack);
            throw error;
        }
    }

    async findAll(): Promise<CreditApplication[]> {
        this.logger.log('Fetching all credit applications');
        const startTime = Date.now();

        try {
            const docs = await this.model.find().exec();
            const result = OutboundMapper.toDomainList(docs);

            const duration = Date.now() - startTime;
            this.logger.log(`Found ${result.length} credit applications, Duration: ${duration}ms`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Failed to fetch credit applications, Duration: ${duration}ms`, error.stack);
            throw error;
        }
    }

    async findByCustomerId(customerId: string): Promise<CreditApplication | null> {
        this.logger.log(`Searching credit application for customer: ${customerId}`);
        const startTime = Date.now();

        try {
            const doc = await this.model.findOne({ customerId }).exec();

            if (!doc) {
                const duration = Date.now() - startTime;
                this.logger.warn(`Credit application not found for customer: ${customerId}, Duration: ${duration}ms`);
                return null;
            }

            const result = OutboundMapper.toDomain(doc);
            const duration = Date.now() - startTime;
            this.logger.log(`Credit application found for customer: ${customerId}, ID: ${result.id}, Duration: ${duration}ms`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Failed to search credit application for customer: ${customerId}, Duration: ${duration}ms`, error.stack);
            throw error;
        }
    }
}
