import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model("product", ProductSchema);

export class ProductModel {
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }

  async findAll() {
    const product = await Product.find({});
    return product;
  }
}

const productModel = new ProductModel();

export { productModel };
