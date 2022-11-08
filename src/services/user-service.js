import { userModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUser(userInfo) {
    const { email, fullName, password, postCode, address, isAdmin, type } =
      userInfo;
    const isExist = await this.userModel.checkByEmail(email);
    if (isExist) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    }

    let newUserInfo;
    if (type === "NOMAL") {
      const hashedPassword = await bcrypt.hash(password, 10);
      newUserInfo = {
        fullName,
        email,
        password: hashedPassword,
        postCode,
        address,
        isAdmin,
        type,
      };
    } else if (type === "SOCIAL") {
      newUserInfo = {
        fullName,
        email,
        postCode,
        address,
        isAdmin,
        type,
      };
    }
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  // 카카오 회원가입 (수정자: 김상현)
  async addKakaoUser(userInfo) {
    const { email, fullName, postCode, address, type } = userInfo;

    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    }

    const newUserInfo = {
      fullName,
      email,
      postCode,
      address,
      type,
    };

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      secretKey
    );

    return { token, user };
  }

  /**
   *
   * @author: 김상현
   * @date: 2022-11-08
   * @detail: 카카오로그인을 위한 서비스 코드
   */
  async getUserTokenForKakao(loginInfo) {
    const { email } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      secretKey
    );

    return { token, user };
  }

  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  // 유저를 삭제할때 비밀번호 일치여부 추가
  // 수정자: 김상현
  // 날짜: 2022-11-03
  async deleteUser(userId, currentPassword) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    const result = await this.userModel.deleteById(userId);
    return result;
  }

  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }

  async checkUserByEmail(email) {
    const isExist = await this.userModel.checkByEmail(email);
    return { isExist };
  }
}

const userService = new UserService(userModel);

export { userService };
