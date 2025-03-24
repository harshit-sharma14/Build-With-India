import axios from 'axios';
import { format } from 'date-fns';

const NYT_API_KEY = 'e8jmvselA60BG3yS2LmBUIWkAUO6dLym'; // Replace with your NYT API key
const NYT_ARCHIVE_API_URL = 'https://api.nytimes.com/svc/archive/v1';
const ALPHA_VANTAGE_API_KEY = 'P7CR9TXKVCPMFHFZ';
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';
const BACKEND_API_URL = 'http://localhost:5000/api/news'; // Replace with your backend URL

export interface CategoryData {
  title: string;
  description: string;
  url: string;
}

export interface NewsData {
  news: CategoryData[];
  finance: CategoryData[];
  culture: CategoryData[];
  tech: CategoryData[];
  entertainment: CategoryData[];
  timestamp: string;
}

export interface StockData {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

// Function to fetch news articles from NYT Archive API

export const fetchNewsData = async (date: string): Promise<NewsData> => {
  try {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth() + 1; // Months are 0-indexed in JavaScript

    const { data } = await axios.get(BACKEND_API_URL, {
      params: { year, month },
    });

    return {
      news: (data?.news ?? []).slice(0, 5),
      finance: (data?.finance ?? []).slice(0, 5),
      culture: (data?.culture ?? []).slice(0, 5),
      tech: (data?.tech ?? []).slice(0, 5),
      entertainment: (data?.entertainment ?? []).slice(0, 5),
      timestamp: date,
    };
  } catch (error) {
    console.error("Error fetching news data:", error);

    return {
      news: [],
      finance: [],
      culture: [],
      tech: [],
      entertainment: [],
      timestamp: date,
    };
  }
};

// Define NewsData below the function
export interface NewsData {
  news: Article[];
  finance: Article[];
  culture: Article[];
  tech: Article[];
  entertainment: Article[];
  timestamp: string;
}

export interface Article {
  title: string;
  description: string;
  url: string;
}


// Fetch stock data (unchanged)
export const fetchStockData = async (symbol: string, date: string): Promise<StockData | null> => {
  try {
    const response = await axios.get(ALPHA_VANTAGE_API_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const timeSeriesData = response.data['Time Series (Daily)'];
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');

    if (timeSeriesData[formattedDate]) {
      return {
        date: formattedDate,
        open: timeSeriesData[formattedDate]['1. open'],
        high: timeSeriesData[formattedDate]['2. high'],
        low: timeSeriesData[formattedDate]['3. low'],
        close: timeSeriesData[formattedDate]['4. close'],
        volume: timeSeriesData[formattedDate]['5. volume'],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};