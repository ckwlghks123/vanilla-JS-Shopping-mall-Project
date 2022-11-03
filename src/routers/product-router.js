import { Router } from "express";
import { upload } from "../utils";
import { asyncHandler } from "../utils";
import { productService } from "../services";
import { loginRequired, adminRequired } from "../middlewares";

const productRouter = Router();
const productlistRouter = Router();

productRouter.post(
  "/register",
  loginRequired,
  adminRequired,
  upload.array("images"),
  asyncHandler(async function (req, res, next) {
    if (!req.namelist || req.namelist.length === 0) {
      throw new Error("상품 이미지가 필요합니다");
    }

    if (req.fileValidationError) {
      throw new Error(req.fileValidationError);
    }
    const { name, price, category, description } = req.body;
    const newProduct = await productService.addProduct({
      name,
      price,
      category,
      description,
      images: req.namelist.map((name) => `/${name}`),
    });
    res.status(201).json(newProduct);
  })
);

productRouter.patch(
  "/:productId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const { productId } = req.params;
    const { name, price, category, description } = req.body;

    const toUpdate = {
      ...(name && { name }),
      ...(price && { price }),
      ...(category && { category }),
      ...(description && { description }),
    };

    const updatedProductInfo = await productService.setProduct(
      productId,
      toUpdate
    );

    res.status(200).json(updatedProductInfo);
  })
);

productRouter.delete(
  "/:productId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const { productId } = req.params;
    const result = await productService.deleteProduct(productId);
    res.status(201).json(result);
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
