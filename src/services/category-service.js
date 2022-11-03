import { categoryModel } from "../db";

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }
  async addCategory(categoryInfo) {
    const createdNewProduct = await this.categoryModel.create(categoryInfo);
    return createdNewProduct;
  }

  async getCategorylist() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await this.categoryModel.findById(categoryId);
    return category;
  }

  async setCategory(categoryId, name) {
    const category = await this.categoryModel.update(categoryId, name);
    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
