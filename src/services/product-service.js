import { productModel } from "../db";

class ProductService {
  async addProduct(productInfo) {
    const createdNewProduct = await productModel.create(productInfo);
    return createdNewProduct;
  }

  async getProductlist() {
    const products = await productModel.findAll();
    return products;
  }

  async getProductById(productId) {
    const product = await productModel.findById(productId);
    return product;
  }
}

const productService = new ProductService();

export { productService };
