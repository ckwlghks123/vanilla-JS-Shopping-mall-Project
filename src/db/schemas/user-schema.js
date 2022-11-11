import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    loginMethod: {
      type: String,
      enum: ["NOMAL", "KAKAO", "NAVER"],
      required: true,
      default: "NOMAL",
    },
    postCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export { UserSchema };
