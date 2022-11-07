import express, { Router } from 'express';
import path from 'path';
import is from '@sindresorhus/is';
import { categoryService, productService } from '../services';
import { asyncHandler } from '../utils';

const menuRouter = express.Router();

menuRouter.get(
    '/',
    asyncHandler(async function (req, res, next) {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    })
);

menuRouter.get(
    '/products',
    asyncHandler(async function (req, res, next) {
        try {
            const products = await productService.getProductlist();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    })
);

menuRouter.post(
    '/products/:id',
    asyncHandler(async function (req, res, next) {
        try {
            const { id } = req.params;
            const products = await productService.getProductCategoryList(id);
            res.json(products);
        } catch (error) {
            next(error);
        }
    })
);

export { menuRouter };
