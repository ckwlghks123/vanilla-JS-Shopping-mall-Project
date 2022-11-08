import { Schema } from "mongoose";
import { ProductSchema } from "./product-schema";
import { UserSchema } from "./user-schema";

const OrderElementSchema = new Schema({
  product: ProductSchema,
  amount: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    user: UserSchema,
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
