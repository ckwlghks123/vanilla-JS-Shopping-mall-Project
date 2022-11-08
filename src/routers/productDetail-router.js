import express, { Router } from 'express';
import { categoryService, productService, cartService } from '../services';
import { asyncHandler } from '../utils';
import { loginRequired } from '../middlewares/login-required';

const productDetailRouter = express.Router();

productDetailRouter.post(
    '/',
    loginRequired,
    asyncHandler(async function (req, res, next) {
        const userId = req.currentUserId;
        const userCheck = await cartService.getCartByUserId(userId);
        if (userCheck === null) {
            const createdCart = await cartService.addCart(userId, req.body);
        } else {
            const updatedCart = await cartService.upsertCartElementByUserId(userId, req.body);
        }

        res.status(201).json('success');
    })
);

productDetailRouter.post(
    '/:id',
    asyncHandler(async function (req, res, next) {
        const { id: categoryId } = req.params;
        const prodcut = await productService.getProductById(categoryId);
        const category = await categoryService.getCategoryName(prodcut['category']);

        const sumObj = {
            ...prodcut['_doc'],
            categoryName: category['name'],
        };

        res.status(201).json(sumObj);
    })
);

export { productDetailRouter };
