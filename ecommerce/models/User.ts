import { model, models, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
      index: true,
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index(
  { role: 1 },
  {
    unique: true,
    partialFilterExpression: { role: "ADMIN" },
    name: "only_one_admin",
  },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const UserModel = models.User || model("User", userSchema);
