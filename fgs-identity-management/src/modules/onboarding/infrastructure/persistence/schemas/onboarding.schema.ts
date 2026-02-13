import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OnboardingStatus } from '../../../domain/entities/onboarding.entity';

@Schema({ collection: 'users', timestamps: true })
export class OnboardingSchema extends Document {
    @Prop({ required: true, unique: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    document: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: OnboardingStatus, default: OnboardingStatus.REQUESTED })
    status: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;
}

export const OnboardingSchemaDefinition = SchemaFactory.createForClass(OnboardingSchema);
