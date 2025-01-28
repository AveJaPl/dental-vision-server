import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAuth = async (token: string): Promise<string | null> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        return user ? decoded.userId : null;
    } catch (error) {
        return null;
    }
};
