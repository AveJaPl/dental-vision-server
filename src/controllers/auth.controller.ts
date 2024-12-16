import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import generateToken from '../utils/token.generator';
import logger from '../logger';

const prisma = new PrismaClient();

// Register function
export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    logger.info(`Registering user with data: ${email}, ${name}`);
    try {
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

        res.status(201).json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Login function
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate a JWT token
        const token = generateToken(user.id);

        res.status(200).json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};