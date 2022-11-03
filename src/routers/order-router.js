import { Router } from "express";
import { asyncHandler } from "../utils";
import { orderService } from "../services";
import { loginRequired, adminRequired } from "../middlewares";

const orderRouter = Router();
const orderlistRouter = Router();

orderRouter.post(
  "/register",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const { list, receiver, phone, address, requirement } = req.body;

    const newOrder = await orderService.addOrder({
      user: req.currentUserId,
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
    if (order.process === "COMPLETED" || order.process === "CANCEL") {
      throw new Error("배송 정보를 수정할 수 없는 상태입니다");
    }

    const { list, receiver, phone, address, requirement, process } = req.body;
    if (process && !req.isAdmin) {
      throw new Error("배송 상태는 관리자만이 수정할 수 있습니다");
    }

    const toUpdate = {
      ...(list && { list }),
      ...(receiver && { receiver }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(requirement && { requirement }),
      ...(process && { process }),
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
    const orders = await orderService.getOrderlistByUserId(userId);
    res.status(201).json(orders);
  })
);

orderlistRouter.get(
  "/:userId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    let { userId } = req.params;
    const orders = await orderService.getOrderlistByUserId(userId);
    res.status(201).json(orders);
  })
);

export { orderRouter, orderlistRouter };
