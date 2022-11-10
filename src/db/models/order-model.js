import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const newOrder = await Order.create(orderInfo);
    return newOrder;
  }

  async findByOrderId(orderId) {
    const order = await Order.findById({ _id: orderId });
    return order;
  }

  async findAll() {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return orders;
  }

  async findByUserId(userId, page, perPage) {
    const [total, orders] = await Promise.all([
      Order.countDocuments({ "user._id": userId }),
      Order.find({ "user._id": userId })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .sort({ createdAt: -1 }),
    ]);

    const totalPage = Math.ceil(total / perPage);
    return { orders, page, perPage, totalPage, totalCount: total };
  }

  async deleteById(orderId) {
    const result = await Order.deleteOne({ _id: orderId });
    return result;
  }

  async update(orderId, update) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false, runValidators: true };
    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
