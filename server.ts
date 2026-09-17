import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not set. AI features will fail.");
    }
    ai = new GoogleGenAI(key ? { apiKey: key } : {});
  }
  return ai;
}

// AI Meal Analysis API
app.post('/api/ai/analyze-food', async (req, res) => {
  try {
    const { foodDescription } = req.body;
    if (!foodDescription) return res.status(400).json({ error: 'Missing foodDescription' });
    
    const client = getAI();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following food item or meal and provide an estimated nutritional breakdown.
Return ONLY a valid JSON object without markdown formatting or backticks.
The JSON must have this structure:
{
  "calories": number,
  "carbs": number,
  "protein": number,
  "fat": number,
  "sugar": number
}
Food description: ${foodDescription}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Meal Analysis Error:", error);
    res.status(500).json({ error: error.message || 'Failed to analyze food' });
  }
});

// AI Meal Recommendation API
app.post('/api/ai/recommend-meals', async (req, res) => {
  try {
    const { profile, recentMeals, averageBloodSugar } = req.body;
    
    const client = getAI();
    const prompt = `You are a diabetic nutrition expert. Recommend 3 personalized meals based on the user's profile and recent data.
Profile: ${JSON.stringify(profile)}
Recent Meals: ${JSON.stringify(recentMeals)}
Average Blood Sugar: ${averageBloodSugar || 'Unknown'}

Return ONLY a valid JSON object without markdown formatting. Structure:
{
  "recommendations": [
    {
      "name": "Meal Name",
      "reason": "Why this is good for them",
      "calories": 400,
      "carbs": 30,
      "sugar": 5
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Meal Recommendation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Exercise Program Recommendation API
app.post('/api/ai/recommend-exercise', async (req, res) => {
  try {
    const { profile, recentExercises, averageBloodSugar } = req.body;
    
    const client = getAI();
    const prompt = `You are an expert fitness coach for diabetic patients. Suggest a personalized exercise program for the next 3 days based on their profile and recent activity.
Profile: ${JSON.stringify(profile)}
Recent Exercises: ${JSON.stringify(recentExercises)}
Average Blood Sugar: ${averageBloodSugar || 'Unknown'}

Return ONLY a valid JSON object without markdown formatting. Structure:
{
  "program": [
    {
      "day": "Day 1",
      "type": "Cardio / Strength / Flexibility",
      "activity": "Detailed activity description",
      "duration": "30 mins",
      "intensity": "Low / Moderate / High",
      "reason": "Why this benefits their blood sugar and fitness level"
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Exercise Recommendation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite in Dev or Static in Prod
async function createServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Production server running on port ${PORT}`);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Development server running on port ${PORT}`);
    });
  }
}

createServer();
