import bcrypt from "bcrypt";
import { storeRefreshToken } from "../token/token.service";
import { User } from "../user/user.model";
import { signAccessToken, signRefreshToken } from "../../common/utils/jwt.utils";

export const registerService = async (data: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(process.env.BCRYPT_ROUNDS)
  );

  const user = await User.create({
    ...data,
    password: hashedPassword,
    role: data.role || "Adopter"
  });

  return user;
};


export const loginService = async (data: {
  email: string;
  password: string;
}) => {

  const user = await User.findOne({ email: data.email });

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!match) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({
    id: user._id,
    role: user.role
  });

  const refreshToken = signRefreshToken({
    id: user._id
  });

  await storeRefreshToken(user._id.toString(), refreshToken);

  return {
    user,
    accessToken,
    refreshToken
  };
};