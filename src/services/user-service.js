import { validate } from "../validation/validation.js";
import {
  registerUserValidation,
  loginUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkUsername = async (username) => {
  if (username.length < 4) {
    throw new ResponseError(400, "Username must be at least 4 characters");
  }

  const user = await prismaClient.users.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    throw new ResponseError(400, "Username already exists");
  }

  return true;
};

const registerUser = async (request) => {
  const user = validate(registerUserValidation, request);

  const email = await prismaClient.users.findUnique({
    where: {
      email: user.email,
    },
  });

  if (email) {
    throw new ResponseError(400, "Email already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return await prismaClient.users.create({
    data: user,
    select: {
      username: true,
      name: true,
      email: true,
      phone_number: true,
      profile_image_path: true,
      role: true,
    },
  });
};

const loginUser = async (request) => {
  const user = validate(loginUserValidation, request);

  const existingUser = await prismaClient.users.findFirst({
    where: {
      OR: [
        {
          username: user.username,
        },
        {
          email: user.username,
        },
      ],
    },
  });

  if (!existingUser) {
    throw new ResponseError(400, "Invalid username or password");
  }

  const isValidPassword = await bcrypt.compare(
    user.password,
    existingUser.password
  );

  if (!isValidPassword) {
    throw new ResponseError(400, "Invalid username or password");
  }

  const payload = {
    id: existingUser.id,
    username: existingUser.username,
    name: existingUser.name,
    email: existingUser.email,
    phone_number: existingUser.phone_number,
    profile_image_path: existingUser.profile_image_path,
    role: existingUser.role,
  };

  if (existingUser.role === "vendor") {
    const vendor = await prismaClient.vendors.findFirst({
      where: {
        user_id: existingUser.id,
      },
      select: {
        id: true,
      },
    });

    payload.vendor_id = vendor.id;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default {
  checkUsername,
  registerUser,
  loginUser,
};
