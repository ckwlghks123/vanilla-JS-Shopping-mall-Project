import { cartModel } from "../db";

class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  async checkCart(userId) {
    const count = await this.cartModel.getCountByUserId(userId);
    return count > 0;
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

  async upsertCartElementByUserId(userId, cartInfo) {
    const updatedCart = await this.cartModel.checkUpdate(userId, cartInfo);
    return updatedCart;
  }

  async deleteCartElementByUserId(userId, cartInfo) {
    const updatedCart = await this.cartModel.updateDelete(userId, cartInfo);
    return updatedCart;
  }

  async deleteCartById(cartId) {
    const cart = await this.cartModel.findDelete(cartId);
    return cart;
  }
}

const cartService = new CartService(cartModel);

export { cartService };
