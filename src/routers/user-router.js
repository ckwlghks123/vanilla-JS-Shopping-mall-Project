import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired, adminRequired } from "../middlewares";
import { userService } from "../services";
import { asyncHandler } from "../utils";

const userRouter = Router();

userRouter.post(
  "/register",
  asyncHandler(async function (req, res, next) {
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
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const email = req.body.email;
    const password = req.body.password;
    const userToken = await userService.getUserToken({ email, password });
    const user = await userService.getUserByEmail(email);
    res.status(200).json({ userToken, user });
  })
);

userRouter.get(
  "/me",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    res.status(201).json(user);
  })
);

userRouter.get(
  "/userlist",
  loginRequired,
  adminRequired,
  asyncHandler(async function (req, res, next) {
    const users = await userService.getUsers();
    res.status(200).json(users);
  })
);

userRouter.get(
  "/user/:userId",
  loginRequired,
  adminRequired,
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
    const result = await userService.deleteUser(userId);
    res.status(201).json(result);
  })
);

userRouter.get(
  "/email/:email",
  asyncHandler(async function (req, res, next) {
    const { email } = req.params;
    const isExist = await userService.checkUserByEmail(email);
    res.status(200).json({ isExist });
  })
);

userRouter.patch(
  "/user",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;
    const { fullName, password, address, currentPassword } = req.body;

    if (!currentPassword) {
      throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
    }

    const userInfoRequired = { userId, currentPassword };
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(postCode && { postCode }),
    };

    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    res.status(200).json(updatedUserInfo);
  })
);

/**
 * @author: 김상현
 * @detail: mypage 회원탈퇴를 위한 delete API
 */
userRouter.delete(
  "/user",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const { password } = req.body;
    const userId = req.currentUserId;
    const deletedUserInfo = await userService.deleteUser(userId, password);

    res.status(200).json(deletedUserInfo);
  })
);

export { userRouter };
