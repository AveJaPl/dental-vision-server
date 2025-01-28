import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../logger';

const prisma = new PrismaClient();

export const checkAuth = async (token: string): Promise<string | null> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        logger.info(`Decoded token: ${JSON.stringify(decoded)}`);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        return user ? decoded.id : null;
    } catch (error) {
        return null;
    }
};
