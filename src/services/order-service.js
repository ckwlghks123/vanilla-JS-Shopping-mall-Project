import { orderModel } from "../db";

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }
  async addOrder(orderInfo) {
    const newOrder = await this.orderModel.create(orderInfo);
    return newOrder;
  }

  async getOrderlist() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  async getOrderlistByUserId(userId, page, perPage) {
    const orders = await this.orderModel.findByUserId(userId, page, perPage);
    return orders;
  }

  async getOrderById(orderId) {
    const order = await this.orderModel.findByOrderId(orderId);
    return order;
  }

  async deleteOrder(orderId) {
    const result = await this.orderModel.deleteById(orderId);
    return result;
  }

  async setOrder(orderId, toUpdate) {
    const order = await orderModel.update(orderId, toUpdate);
    return order;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
