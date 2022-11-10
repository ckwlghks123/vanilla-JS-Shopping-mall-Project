import { Router } from "express";
import { asyncHandler } from "../utils";
import { orderService, cartService } from "../services";
import { loginRequired, adminRequired } from "../middlewares";
import { OrderState } from "../db/schemas/order-schema";

const orderRouter = Router();
const orderStateRouter = Router();
const orderlistRouter = Router();

orderRouter.post(
  "/register",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const { cartId, receiver, phone, address, requirement } = req.body;
    const { user, list } = await cartService.deleteCartById(cartId);

    const newOrder = await orderService.addOrder({
      user,
      list,
      receiver,
      phone,
      address,
      ...(requirement && { requirement }),
    });

    res.status(201).json(newOrder);
  })
);

orderRouter.get(
  "/:orderId",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    res.status(201).json(order);
  })
);

orderRouter.patch(
  "/:orderId",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    if (order.process !== OrderState.wait) {
      throw new Error("주문 정보를 수정할 수 없는 상태입니다");
    }

    const { list, receiver, phone, address, requirement } = req.body;

    const toUpdate = {
      ...(list && { list }),
      ...(receiver && { receiver }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(requirement && { requirement }),
    };

    const updatedOrder = await orderService.setOrder(orderId, toUpdate);
    res.status(201).json(updatedOrder);
  })
);

orderRouter.delete(
  "/:orderId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const { orderId } = req.params;
    const result = await orderService.deleteOrder(orderId);
    res.status(201).json(result);
  })
);

orderlistRouter.get(
  "/",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const orders = await orderService.getOrderlist();
    res.status(201).json(orders);
  })
);

orderlistRouter.get(
  "/me",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.currentUserId;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const orders = await orderService.getOrderlistByUserId(
      userId,
      page,
      perPage
    );
    res.status(201).json(orders);
  })
);

orderlistRouter.get(
  "/:userId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const { userId } = req.params;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const orders = await orderService.getOrderlistByUserId(
      userId,
      page,
      perPage
    );
    res.status(201).json(orders);
  })
);

orderStateRouter.post(
  "/:orderId",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const {
      params: { orderId },
      body: { process },
      isAdmin,
    } = req;
    const order = await orderService.getOrderById(orderId);
    if (
      order.process === OrderState.completed ||
      order.process === OrderState.cancel
    ) {
      throw new Error("해당 주문은 더이상 배송 상태를 변경할 수 없습니다");
    }

    if (
      !isAdmin &&
      (order.process !== OrderState.wait || process !== OrderState.cancel)
    ) {
      throw new Error("배송 대기 상태일 때에만 주문을 취소할 수 있습니다");
    }

    const updatedOrder = await orderService.setOrder(orderId, { process });
    res.status(201).json(updatedOrder);
  })
);

export { orderRouter, orderStateRouter, orderlistRouter };
