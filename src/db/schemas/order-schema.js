import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    }, 
    // product: {
    //   type: Schema.Types.ObjectId,
    //   requred: true,
    //   ref: "product",
    // },
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
    request: {
      type: String,
    }
    // amount: {
    //   type: Number,
    //   required: true,
    // },
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

const orderInfoSchema = new Schema({

})

export { OrderSchema };
