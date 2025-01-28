import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/token.generator";
import logger from "../logger";

const prisma = new PrismaClient();

// Register function
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  logger.info(`Registering user with data: ${email}, ${name}`);
  try {
    // Check if the user already exists
    const exisitingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exisitingUser) {
      logger.error(JSON.stringify(exisitingUser));
      res.json({ status: 409, message: "User already exists", data: null });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate a JWT token
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".lukaszszczesiak.pl"
    });
    res.json({ status: 201, message: null, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info(`Logging in user with email: ${email}`);
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.json({ status: 404, message: "User not found", data: null });
      return;
    }

    // Check the password
    const isPasswordValid = bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      res.json({ status: 401, message: "Invalid credentials", data: null });
      return;
    }

    // Generate a JWT token
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".lukaszszczesiak.pl"
    });
    res.json({ status: 200, message: "Logged in", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
