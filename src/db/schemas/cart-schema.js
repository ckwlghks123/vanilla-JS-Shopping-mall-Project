import { Schema } from "mongoose";

const CartElementSchema = new Schema({
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

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    list: [CartElementSchema],
  },
  {
    // collection: "cart",
    timestamps: true,
  }
);

export { CartSchema };
