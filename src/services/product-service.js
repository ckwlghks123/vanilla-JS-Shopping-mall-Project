import { productModel } from "../db";

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    const createdNewProduct = await this.productModel.create(productInfo);
    return createdNewProduct;
  }

  async getProductlist() {
    const products = await this.productModel.findAll();
    return products;
  }

  async getProductById(productId) {
    const product = await this.productModel.findById(productId);
    return product;
  }

  async setProduct(productId, toUpdate) {
    const product = await this.productModel.update(productId, toUpdate);
    return product;
  }

  async deleteProduct(productId) {
    const result = await this.productModel.deleteById(productId);
    return result;
  }
}

const productService = new ProductService(productModel);

export { productService };
