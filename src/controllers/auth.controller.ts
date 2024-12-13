import { Request, Response } from 'express';
import User from '../models/user.model';


export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = user.generateToken();
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User
            .findOne({ email })
            .select('+password')
            .exec();
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = user.generateToken();
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
