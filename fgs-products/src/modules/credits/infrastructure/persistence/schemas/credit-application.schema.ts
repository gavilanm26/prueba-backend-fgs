import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'credit_applications' })
export class CreditApplicationDocument extends Document {
    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true })
    purpose: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    term: number;

    @Prop({ required: true, default: 'PENDING' })
    status: string;
}

export const CreditApplicationSchema = SchemaFactory.createForClass(CreditApplicationDocument);
