import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({}).sort({ createdAt: -1 });
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  // 이메일로 확인 후 이름 업데이트 하는 임시 메서드
  // author: 김상현
  async updateNameByEmail({ email, update }) {
    const filter = { email };
    const option = { returnOriginal: false };
    update = { fullName: update };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  // 이메일로 확인 후 비밀번호 업데이트 하는 임시 메서드
  // author: 김상현
  async updatePasswordByEmail({ email, update }) {
    const filter = { email };
    const option = { returnOriginal: false };
    update = { password: update };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  async deleteById(userId) {
    const result = await User.deleteOne({ _id: userId });
    return result;
  }
}

const userModel = new UserModel();

export { userModel };
