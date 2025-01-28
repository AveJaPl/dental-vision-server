import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById} from '../models/user.model';

export const analyze = async (req: Request, res: Response) => {
    try {
        // Pobierz token z ciasteczka HTTP-Only
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: 'Brak tokena uwierzytelniającego.' });
        }

        // Zweryfikuj token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return res.status(401).json({ error: 'Nieprawidłowy token uwierzytelniający.' });
        }

        // Sprawdź, czy użytkownik istnieje w bazie danych
        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony.' });
        }

        // Obsługa zdjęć
        const images = req.files; // Wiele zdjęć
        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'Brak obrazów w żądaniu.' });
        }

        try {
            const analysisResults = "Symulowana wiadomość"
            return res.status(200).json({
                message: analysisResults,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Wystąpił błąd podczas komunikacji z OpenAI API.' });
        }
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
