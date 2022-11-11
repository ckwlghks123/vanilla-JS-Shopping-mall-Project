import { userModel } from "../db";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getPasswordField = async (loginMethod, password = "") => {
  switch (loginMethod) {
    case "NOMAL":
      const hashedPassword = await bcrypt.hash(password, 10);
      return { password: hashedPassword };
    default:
      return {};
  }
};

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUser(userInfo) {
    const {
      email,
      fullName,
      password,
      postCode,
      address,
      isAdmin,
      loginMethod,
    } = userInfo;

    const isExist = await this.userModel.checkByEmail(email);
    if (isExist) {
      if (loginMethod === "NOMAL") {
        throw new Error(
          "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
        );
      } else {
        // 기존 회원 이메일과 소셜 이메일이 같으면 프론트에서 바로 로그인
        return;
      }
    }

    const passwordField = await getPasswordField(loginMethod, password);
    const newUserInfo = {
      fullName,
      email,
      postCode,
      address,
      isAdmin,
      loginMethod,
      ...passwordField,
    };

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
   * @detail: 소셜로그인을 위한 서비스 코드
   */
  async getUserTokenForSocial(loginInfo) {
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
    if (!correctPasswordHash) {
      throw new Error(
        "비밀번호를 설정하지 않았습니다. 유저정보 변경을 통해 비밀번호를 설정해주세요."
      );
    }
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

    if (currentPassword) {
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
