import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import logger from '../logger';

const prisma = new PrismaClient();

export const getUserData = async (req: Request, res: Response) => {
    try {
        logger.info({message: "Token from Bearer: " + req.headers.authorization})
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log(decoded)
        const userId = decoded.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        logger.info({message: JSON.stringify(user)})
        res.json(user);
    } catch (error: any) {
        logger.error({message: error.message})
        res.status(500).json({ message: 'Internal server error', error: error});
    }
};