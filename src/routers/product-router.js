import { Router } from "express";
import { upload } from "../utils";
import { asyncHandler } from "../utils";
import { productService } from "../services";

const productRouter = Router();
const productlistRouter = Router();

productRouter.post(
  "/register",
  upload.single("img"),
  asyncHandler(async function (req, res, next) {
    const newProduct = await productService.addProduct(req.body);
    res.status(201).json(newProduct);
  })
);

productRouter.get(
  "/:id",
  asyncHandler(async function (req, res, next) {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(201).json(product);
  })
);

productlistRouter.get(
  "/",
  asyncHandler(async function (req, res, next) {
    const products = await productService.getProductlist();
    res.status(201).json(products);
  })
);

export { productRouter, productlistRouter };
