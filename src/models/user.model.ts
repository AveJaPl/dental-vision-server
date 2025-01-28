// Here types for User model are defined in src/models/user.model.ts:
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
    });
};