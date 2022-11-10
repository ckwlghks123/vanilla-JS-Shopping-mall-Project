import cors from 'cors';
import express from 'express';
import {
    viewsRouter,
    userRouter,
    productRouter,
    menuRouter,
    categoryRouter,
    productDetailRouter,
    orderRouter,
    orderlistRouter,
    orderStateRouter,
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

// images static 라우팅
app.use('/uploads', express.static('uploads'));

app.use('/api', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/productdetail', productDetailRouter);
app.use('/api/menu', menuRouter);
app.use('/api/order', orderRouter);
app.use('/api/orderstate', orderStateRouter);
app.use('/api/orderlist', orderlistRouter);
app.use('/api/cart', cartRouter);

app.use(function (req, res, next) {
    res.redirect("/error")
});

//  next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
