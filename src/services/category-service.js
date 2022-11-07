import { categoryModel } from '../db';

//카테고리
class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }

    // 카테고리 전체 조회
    async getCategories() {
        const categories = await this.categoryModel.findAllCategories();
        return categories;
    }

    // 카테고리Id 가져오기
    async getCategoryId(name) {
        const categoryId = await this.categoryModel.getCategoryId(name);
        return categoryId;
    }

    // 카테고리 이름 가져오기
    async getCategoryName(id) {
        const categoryName = await this.categoryModel.getCategoryName(id);
        return categoryName;
    }

    // 카테고리 생성
    async createCategory(categoryName) {
        const createdCategory = await this.categoryModel.createCategory(categoryName);
        return createdCategory;
    }

    // 카테고리 삭제
    async deleteCategory(categoryName) {
        const deletedCategory = await this.categoryModel.deleteCategory(categoryName);
        return deletedCategory;
    }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
