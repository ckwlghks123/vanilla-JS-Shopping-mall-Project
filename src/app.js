import cors from 'cors';
import express from 'express';
import {
    viewsRouter,
    userRouter,
    productRouter,
    productlistRouter,
    categoryRouter,
    categorylistRouter,
    orderRouter,
    orderlistRouter,
    cartRouter,
} from './routers';
import { errorHandler } from './middlewares';

const app = express();

app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

app.use('/api', userRouter);
app.use('/api/products', productRouter);
//app.use("/api/productlist", productlistRouter);
app.use('/api/categories', categoryRouter);
//app.use("/api/categorylist", categorylistRouter);
//app.use("/api/order", orderRouter);
//app.use("/api/orderlist", orderlistRouter);
//app.use("/api/cart", cartRouter);

app.use(function (req, res, next) {
    res.status(404).json({ result: 'error', reason: 'page not found' });
});

//  next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
