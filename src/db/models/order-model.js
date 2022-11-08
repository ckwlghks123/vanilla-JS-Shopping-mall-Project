import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const newOrder = await Order.create(orderInfo);
    return newOrder;
  }

  async findByOrderId(orderId) {
    const order = await Order.findById({ _id: orderId })
      .populate("user")
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      });
    return order;
  }

  async findAll() {
    const orders = await Order.find({})
      .populate("user")
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });
    return orders;
  }

  async findByUserId(userId) {
    const orders = await Order.find({ user: userId })
      .populate("user")
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });
    return orders;
  }

  async deleteById(orderId) {
    const result = await Order.deleteOne({ _id: orderId });
    return result;
  }

  async update(orderId, update) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };
    const updatedOrder = await Order.findOneAndUpdate(filter, update, option)
      .populate("user")
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      });
    return updatedOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
