import { Schema, model, Document } from 'mongoose';

interface IQuote extends Document {
  quote: string;
  userId?: string;
  guildId: string;
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    quote: { type: String, required: true },
    userId: { type: String, required: false },
    guildId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Quote = model<IQuote>('Quote', quoteSchema);

export default Quote;
