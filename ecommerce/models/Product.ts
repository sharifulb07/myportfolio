import { model, models, Schema, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: { type: [String], required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", description: "text", category: "text" });

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const ProductModel = models.Product || model("Product", productSchema);
