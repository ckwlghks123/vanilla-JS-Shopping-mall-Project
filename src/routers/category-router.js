import express, { Router } from "express";
import path from "path";
import is from "@sindresorhus/is";
import { categoryService, productService } from "../services";
import { upload } from "../utils/upload";

const categoryRouter = express.Router();

// 카테고리 전체조회
categoryRouter.get("/", async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
});

// 카테고리 생성
categoryRouter.post("/", async (req, res, next) => {
    try {
        const { categoryName: name } = req.body;
        const createdCategory = await categoryService.createCategory({ name });
        res.status(201).json(createdCategory);
    } catch (error) {
        next(error);
    }
});

// 카테고리 삭제
categoryRouter.delete("/:name", async (req, res, next) => {
    const { name } = req.params;

    try {
        const deleteCategory = await categoryService.deleteCategory({ name });
        res.json(deleteCategory);
    } catch (error) {
        next(error);
    }
});

// 카테고리 수정 미사용
// categoryRouter.patch(
//     '/:categoryId',
//     loginRequired,
//     adminRequired,
//     asyncHandler(async function (req, res, next) {
//         const { categoryId } = req.params;
//         const { name } = req.body;

//         const updatedCategory = await categoryService.setCategory(categoryId, name);
//         res.status(201).json(updatedCategory);
//     })
// );

// 상품 전체 조회
categoryRouter.get("/products", async (req, res, next) => {
    try {
        const products = await productService.findAllProducts();
        req.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

export { categoryRouter };
