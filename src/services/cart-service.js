import { cartModel } from "../db";

class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  async checkCart(userId) {
    const cnt = await this.cartModel.getCntByUserId(userId);
    return cnt > 0;
  }

  async getCartByUserId(userId) {
    const cart = await this.cartModel.findByUserId(userId);
    return cart;
  }

  async addCart(userId, cartInfo) {
    const newCart = await this.cartModel.create({
      user: userId,
      list: [cartInfo],
    });
    return newCart;
  }

  async setCartByUserId(userId, cartInfo, method) {
    if (method === "POST") {
      const updatedCart = await this.cartModel.checkUpdate(userId, cartInfo);
      return updatedCart;
    } else {
      const updatedCart = await this.cartModel.updateDelete(userId, cartInfo);
      return updatedCart;
    }
  }
}

const cartService = new CartService(cartModel);

export { cartService };
