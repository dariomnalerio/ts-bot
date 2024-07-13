import { Schema, model, Document } from 'mongoose';

interface IAfkCount extends Document {
  userId: string;
  guildId: string;
  count: number;
}

const afkCountSchema = new Schema<IAfkCount>({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const AfkCount = model<IAfkCount>('AfkCount', afkCountSchema);

export default AfkCount;
