import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeImagesWithOpenAI = async (images: Express.Multer.File[]) => {
    const analysisResults: string[] = [];

    for (const image of images) {
        const imageBuffer = fs.readFileSync(image.path);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'Jesteś asystentem medycznym specjalizującym się w szczegółowej analizie zdjęć dentystycznych...',
                },
                {
                    role: 'user',
                    content: `Oceń zdjęcie:`,
                },
            ],
            files: [
                {
                    name: image.originalname,
                    type: image.mimetype,
                    data: imageBuffer,
                },
            ],
        });

        const result = response.choices[0]?.message?.content ?? 'Nie udało się przeprowadzić analizy obrazu.';
        analysisResults.push(result);
    }

    return analysisResults;
};
