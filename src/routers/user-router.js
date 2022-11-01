import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, adminRequired } from "../middlewares";
import { userService } from "../services";
import { asyncHandler } from "../utils";

const userRouter = Router();

userRouter.post(
  "/register",
  asyncHandler(async function (req, res, next) {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const { fullName, email, password, postCode, address, isAdmin } = req.body;

    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      postCode,
      address,
      isAdmin,
    });

    res.status(201).json(newUser);
  })
);

userRouter.post(
  "/login",
  asyncHandler(async function (req, res, next) {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  })
);

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get(
  "/userlist",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  })
);

userRouter.patch(
  "/user/:userId",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // params로부터 id를 가져옴
    const userId = req.params.userId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { fullName, password, address } = req.body;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  })
);

userRouter.get(
  "/user/:userId",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const { userId } = req.params;
    const user = await userService.getUser(userId);
    res.status(201).json(user);
  })
);

userRouter.delete(
  "/user/:userId",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const { userId } = req.params;
    const user = await userService.deleteUser(userId);
    res.json(user);
  })
);

export { userRouter };
