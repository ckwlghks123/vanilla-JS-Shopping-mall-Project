import { model } from "mongoose";
import { CartSchema } from "../schemas/cart-schema";

const Cart = model("cart", CartSchema);

export class CartModel {
  async getCountByUserId(userId) {
    const count = await Cart.countDocuments({ user: userId });
    return count;
  }

  async create(cartInfo) {
    const created = await Cart.create(cartInfo);
    const populated = created.populate({
      path: "list",
      populate: {
        path: "product",
      },
    });
    return populated;
  }

  async findByUserId(userId) {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });
    return cart;
  }

  async checkUpdate(userId, update) {
    const cart = await Cart.findOne({ user: userId });
    let isExistElement = false;
    const updatedList = [];
    cart.list.forEach((el) => {
      if (el.product == update.product) {
        updatedList.push(update);
        isExistElement = true;
      } else {
        updatedList.push(el);
      }
    });

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { list: isExistElement ? updatedList : [...updatedList, update] },
      {
        returnDocument: "after",
      }
    )
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });

    return updatedCart;
  }

  async updateDelete(userId, update) {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { list: update } },
      {
        returnDocument: "after",
      }
    )
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });

    if (!updatedCart.list.length) {
      await Cart.deleteOne({ user: userId });
    }

    return updatedCart;
  }

  async findDelete(cartId) {
    const cart = await Cart.findOneAndDelete(
      { _id: cartId },
      { returnDocument: "before" }
    )
      .populate("user")
      .populate({
        path: "list",
        populate: {
          path: "product",
        },
      })
      .sort({ createdAt: -1 });
    return cart;
  }
}

const cartModel = new CartModel();

export { cartModel };
