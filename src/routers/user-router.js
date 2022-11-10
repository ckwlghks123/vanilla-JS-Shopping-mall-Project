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

    const {
      fullName,
      email,
      password,
      postCode,
      address,
      isAdmin,
      loginMethod,
    } = req.body;

    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      postCode,
      address,
      isAdmin,
      loginMethod,
    });

    res.status(201).json(newUser);
  })
);

// 소셜로그인을 통한 회원가입을 위한 API (수정자: 김상현)
userRouter.post(
  "/register-social",
  asyncHandler(async function (req, res, next) {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const { fullName, email, postCode, address, loginMethod } = req.body;

    const newUser = await userService.addUser({
      fullName,
      email,
      postCode,
      address,
      loginMethod,
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
    const { token, user } = await userService.getUserToken({ email, password });
    res.status(200).json({ userToken: token, user });
  })
);

/**
 * @author: 김상현
 * @date: 2022-11-08
 * @detail: 소셜로그인을 위한 로그인API
 */
userRouter.post(
  "/login-social",
  asyncHandler(async function (req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const email = req.body.email;
    const { token, user } = await userService.getUserTokenForSocial({ email });
    res.status(200).json({ userToken: token, user });
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
    const { isExist } = await userService.checkUserByEmail(email);
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
    const { fullName, password, address, currentPassword, postCode } = req.body;

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
 * @date: 2022-11-08
 * @detail: 소셜유저의 비밀번호 설정을 위한 API
 */
userRouter.patch(
  "/user/password",
  loginRequired,
  asyncHandler(async function (req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;
    const { password } = req.body;

    const updatedUserInfo = await userService.setUser({ userId }, { password });

    res.status(200).json(updatedUserInfo);
  })
);

/**
 * @author: 김상현
 * @detail: mypage 회원탈퇴를 위한 delete API
 */
userRouter.post(
  "/signout",
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
