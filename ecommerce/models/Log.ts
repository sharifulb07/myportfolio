import { model, models, Schema, type InferSchemaType } from "mongoose";

const logSchema = new Schema(
  {
    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      required: true,
      index: true,
    },
    event: { type: String, required: true, index: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type LogDocument = InferSchemaType<typeof logSchema>;

export const LogModel = models.Log || model("Log", logSchema);
