import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());
const NYT_API_KEY = 'e8jmvselA60BG3yS2LmBUIWkAUO6dLym';
app.get('/api/news', async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ error: 'Year and month are required' });
    }

    try {
        const response = await axios.get(`https://api.nytimes.com/svc/archive/v1/${year}/${month}.json`, {
            params: { 'api-key': NYT_API_KEY },
        });

        const articles = response.data.response.docs;

        // Categorize articles
        const categorizedNews = {
            news: [],
            finance: [],
            culture: [],
            tech: [],
            entertainment: []
        };

        articles.forEach((article) => {
            const category = article.news_desk?.toLowerCase() || 'news'; // Default to 'news'
            const formattedArticle = {
                title: article.headline.main,
                description: article.snippet || 'No description available',
                url: article.web_url,
            };

            if (category.includes('business') || category.includes('finance')) {
                categorizedNews.finance.push(formattedArticle);
            } else if (category.includes('culture') || category.includes('arts')) {
                categorizedNews.culture.push(formattedArticle);
            } else if (category.includes('technology')) {
                categorizedNews.tech.push(formattedArticle);
            } else if (category.includes('entertainment') || category.includes('movies')) {
                categorizedNews.entertainment.push(formattedArticle);
            } else {
                categorizedNews.news.push(formattedArticle);
            }
        });

        res.json(categorizedNews);
    } catch (e) {
        console.error('Error fetching NYT archive news:', e);
        res.status(500).json({ error: e });
    }
});

const genAI = new GoogleGenerativeAI("AIzaSyAtr1YACOukt8641fzsZhMR0E-MutDX8cg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const text = await result.response.text(); // Extract the text from the response
    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));