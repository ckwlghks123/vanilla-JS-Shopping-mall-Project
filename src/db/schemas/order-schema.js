import { Schema } from "mongoose";
import { ProductSchema } from "./product-schema";
import { UserSchema } from "./user-schema";

class OrderState {
  static wait = "WAIT";
  static inprogress = "INPROGRESS";
  static completed = "COMPLETED";
  static cancel = "CANCEL";
}

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
      enum: [
        OrderState.wait,
        OrderState.inprogress,
        OrderState.completed,
        OrderState.cancel,
      ],
      required: false,
      default: OrderState.wait,
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema, OrderState };
