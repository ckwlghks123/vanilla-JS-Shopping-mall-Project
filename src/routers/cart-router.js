import { Router } from "express";
import { asyncHandler } from "../utils";
import { cartService } from "../services";
import { loginRequired } from "../middlewares";

const cartRouter = Router();

cartRouter.get(
  "/",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.currentUserId;
    const cart = await cartService.getCartByUserId(userId);

    res.status(201).json(cart);
  })
);

cartRouter.post(
  "/",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.currentUserId;
    const { productId, amount } = req.body;
    const isExist = await cartService.checkCart(userId);

    if (isExist) {
      // 업데이트
      const cart = await cartService.setCartByUserId(
        userId,
        {
          product: productId,
          amount,
        },
        req.method
      );
      res.status(201).json(cart);
    } else {
      // 생성
      const cart = await cartService.addCart(userId, {
        product: productId,
        amount,
      });
      res.status(201).json(cart);
    }
  })
);

cartRouter.delete(
  "/",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.currentUserId;
    const { productId } = req.body;
    const cart = await cartService.setCartByUserId(
      userId,
      {
        product: productId,
      },
      req.method
    );
    res.status(201).json(cart);
  })
);

export { cartRouter };
