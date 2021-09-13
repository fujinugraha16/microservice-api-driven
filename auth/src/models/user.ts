import { Schema, model } from "mongoose";

// constanta
import { Role } from "@fujingr/common";

interface UserAttrs {
  username: string;
  password: string;
  name: string;
  role: Role;
  avatar?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

const userSchema = new Schema<UserAttrs>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    avatar: String,
    phoneNumber: String,
    email: String,
    address: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

const userModel = model<UserAttrs>("User", userSchema);

export { userModel as User, UserAttrs };
