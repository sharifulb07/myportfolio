import { model, models, Schema, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    products: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD"], default: "COD" },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = models.Order || model("Order", orderSchema);
