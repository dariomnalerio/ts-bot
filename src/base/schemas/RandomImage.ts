// Assuming you have a MongoDB setup with Mongoose
import { Schema, model, Document } from "mongoose";

export interface ImageModel extends Document {
  imageUrl: string;
}

const ImageSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
});

const RandomImage = model<ImageModel>("RandomImage", ImageSchema);

export default RandomImage;
