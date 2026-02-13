
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardingRepositoryPort } from '../../../../domain/ports/onboarding.repository.port';
import { Onboarding } from '../../../../domain/entities/onboarding.entity';
import { OnboardingSchema } from '../../../persistence/schemas/onboarding.schema';
import { OnboardingOutboundMapper } from '../mappers/outbound.mapper';

@Injectable()
export class MongoOnboardingRepository implements OnboardingRepositoryPort {
    private readonly logger = new Logger(MongoOnboardingRepository.name);

    constructor(
        @InjectModel(OnboardingSchema.name)
        private readonly model: Model<OnboardingSchema>,
    ) { }

    async save(onboarding: Onboarding): Promise<Onboarding> {
        this.logger.log(`Guardando onboarding en MongoDB: ${onboarding.id} `);

        const persistence = OnboardingOutboundMapper.toPersistence(onboarding);
        this.logger.log(`Objeto a persistir: ${JSON.stringify(persistence)} `);

        try {
            const created = await this.model.findOneAndUpdate(
                { id: onboarding.id },
                { $set: persistence },
                { upsert: true, new: true },
            );
            return OnboardingOutboundMapper.toDomain(created);
        } catch (error) {
            if (error.code === 11000) {
                this.logger.error(`Error de duplicado: ${JSON.stringify(error.keyValue)} `);
                throw new ConflictException(`El registro ya existe: ${Object.keys(error.keyValue).join(', ')} duplicado`);
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Onboarding | null> {
        this.logger.log(`Buscando onboarding por ID: ${id} `);
        const found = await this.model.findOne({ id }).exec();
        if (!found) return null;
        return OnboardingOutboundMapper.toDomain(found);
    }

    async findByDocument(document: string): Promise<Onboarding | null> {
        this.logger.log(`Buscando onboarding por documento: ${document} `);
        const found = await this.model.findOne({ document }).exec();
        if (!found) return null;
        return OnboardingOutboundMapper.toDomain(found);
    }

    async findByUsername(username: string): Promise<Onboarding | null> {
        this.logger.log(`Buscando onboarding por usuario: ${username} `);
        const found = await this.model.findOne({ username }).exec();
        if (!found) return null;
        return OnboardingOutboundMapper.toDomain(found);
    }
}
