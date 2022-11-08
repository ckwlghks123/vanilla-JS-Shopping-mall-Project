import { Schema } from "mongoose";

const OrderElementSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "products",
  },
  amount: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    list: {
      type: [OrderElementSchema],
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    requirement: {
      type: String,
      required: false,
      default: "",
    },
    process: {
      type: String,
      enum: ["WAIT", "INPROGRESS", "COMPLETED", "CANCEL"],
      required: false,
      default: "WAIT",
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
