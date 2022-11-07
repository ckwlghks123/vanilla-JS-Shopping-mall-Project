import { productModel } from '../db';

// 상품
class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    //상품추가
    async addProduct(productInfo) {
        const createdNewProduct = await this.productModel.createProduct(productInfo);
        return createdNewProduct;
    }

    //상품 전체 리스트
    async getProductlist() {
        const products = await this.productModel.findAll();
        return products;
    }

    // 상품 카테고리별 리스트
    async getProductCategoryList(categoryId) {
        const products = await this.productModel.findCategory(categoryId);
        return products;
    }

    // 특정 상품 선택
    async getProductById(productId) {
        const product = await this.productModel.findById(productId);
        return product;
    }

    // 상품 수정
    async setProduct(productId, toUpdate) {
        const product = await this.productModel.update(productId, toUpdate);
        return product;
    }

    // 상품 삭제
    async deleteProduct(productId) {
        const result = await productModel.deleteById(productId);
        return result;
    }
}

const productService = new ProductService(productModel);

export { productService };
