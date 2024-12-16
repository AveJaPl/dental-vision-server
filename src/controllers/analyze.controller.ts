// Controller for the analyze endpoint

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
// import { analyzePhoto } from '../utils/analyze.photo';
const prisma = new PrismaClient();

export const analyze = async (req: Request, res: Response) => {
    const { text } = req.body;
    try {
        // const analysis = analyzeText(text);
        const analysis = text; // temporary

        res.status(200).json({ analysis });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};