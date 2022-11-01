import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    product: {
      type: Schema.Types.ObjectId,
      requred: true,
      ref: "product",
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    process: {
      type: String,
      enum: ["WAIT", "INPROGRESS", "COMPLETED"],
      required: true,
    },
  },
  {
    collection: "order",
    timestamps: true,
  }
);

export { OrderSchema };
