import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export default generateToken;
