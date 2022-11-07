import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
    async findAllCategories() {
        const categories = await Category.find({});
        return categories;
    }
    async getCategoryId(name) {
        const searchId = await Category.findOne({ name }).select('_id');
        const { _id: id } = searchId;
        return id.toString();
    }

    async getCategoryName(id) {
        const searchName = await Category.findOne({ _id: id }).select('name');
        return searchName;
    }

    // 현재 미사용
    async update(categoryId, name) {
        const filter = { _id: categoryId };
        const option = { returnOriginal: false };
        const updatedCategory = await Category.findByIdAndUpdate(filter, { name }, option);
        return updatedCategory;
    }

    async createCategory(name) {
        const createdCategory = await Category.create(name);
        return createdCategory;
    }
    async deleteCategory(name) {
        const deletedCategory = await Category.deleteOne(name);
        return deletedCategory;
    }
}

const categoryModel = new CategoryModel();

export { categoryModel };
