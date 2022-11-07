import express, { Router } from 'express';
import path from 'path';
import is from '@sindresorhus/is';
import { categoryService, productService } from '../services';
import { asyncHandler } from '../utils';
import fs from 'fs';

const productDetailRouter = express.Router();

export { productDetailRouter };
