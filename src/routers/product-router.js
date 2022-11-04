import express, { Router } from 'express';
import path from 'path';
import is from '@sindresorhus/is';
import { categoryService, productService } from '../services';
import { upload } from '../utils/upload';

const productRouter = express.Router();

// 상품 생성
// 카테고리쪽 모델 잘못됨 PR
productRouter.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const { name, price, category, description } = req.body;
        const categoryId = await categoryService.getCategoryId(category);
        const createdProduct = await productService.addProduct({
            name,
            price,
            category: categoryId,
            description,
            images: [req.file.path],
        });

        res.status(201).json('success');
    } catch (error) {
        next(error);
    }
});

// 수정
// productRouter.patch(
//     '/:productId',
//     loginRequired,
//     adminRequired,
//     asyncHandler(async function (req, res, next) {
//         const { productId } = req.params;
//         const { name, price, category, description } = req.body;

//         const toUpdate = {
//             ...(name && { name }),
//             ...(price && { price }),
//             ...(category && { category }),
//             ...(description && { description }),
//         };

//         const updatedProductInfo = await productService.setProduct(productId, toUpdate);

//         res.status(200).json(updatedProductInfo);
//     })
// );

// 삭제
// productRouter.delete(
//     '/:productId',
//     loginRequired,
//     adminRequired,
//     asyncHandler(async function (req, res, next) {
//         const { productId } = req.params;
//         const result = await productService.deleteProduct(productId);
//         res.status(201).json(result);
//     })
// );

export { productRouter };
