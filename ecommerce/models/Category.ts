import { model, models, Schema, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const CategoryModel =
  models.Category || model("Category", categorySchema);
