import express, { Router } from 'express';
import path from 'path';
import is from '@sindresorhus/is';
import { categoryService, productService } from '../services';
import { upload } from '../utils/upload';
import { asyncHandler } from '../utils';
import fs from 'fs';

const productRouter = express.Router();

// 상품 가져오기
productRouter.get('/', async (req, res, next) => {
    try {
        const products = await productService.getProductlist();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// 상품 생성
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
// loginRequired,
// adminRequired,
productRouter.patch(
    '/:productId',
    upload.single('image'),
    asyncHandler(async function (req, res, next) {
        const { productId } = req.params;
        const { name, price, category, description } = req.body;
        const categoryId = await categoryService.getCategoryId(category);

        let toUpdate = {
            ...(name && { name }),
            ...(price && { price }),
            ...(category && { category: categoryId }),
            ...(description && { description }),
        };

        if (req.file !== undefined) {
            const { images } = await productService.getProductById(productId);
            const imgPath = images[0];
            fs.unlinkSync(imgPath);
            toUpdate = { ...toUpdate, images: [req.file.path] };
        }

        const updatedProductInfo = await productService.setProduct(productId, toUpdate);
        res.status(201).json('success');
    })
);

// 삭제
//loginRequired,
//adminRequired,
productRouter.delete(
    '/:productId',
    asyncHandler(async function (req, res, next) {
        try {
            const { productId } = req.params;
            const { images } = await productService.getProductById(productId);
            const imgPath = images[0];
            fs.unlinkSync(imgPath);
            const result = await productService.deleteProduct(productId);
            res.json('delete');
        } catch (error) {
            next(error);
        }
    })
);

export { productRouter };
