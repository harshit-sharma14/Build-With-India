import axios from 'axios';
import { format } from 'date-fns';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const ALPHA_VANTAGE_API_KEY = 'P7CR9TXKVCPMFHFZ';
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';

export interface WikiEvent {
  title: string;
  extract: string;
  timestamp: string;
}

export interface CategoryData {
  title: string;
  extract: string;
  url: string;
}

export interface WikipediaData {
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

const fetchWikipediaCategory = async (date: string, category: string): Promise<CategoryData[]> => {
  const formattedDate = format(new Date(date), 'yyyy');
  const searchQuery = `${category} ${formattedDate}`;
  
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: searchQuery,
        srlimit: 3,
        origin: '*'
      }
    });

    const results = response.data.query.search;
    
    // Fetch detailed information for each result
    const detailedResults = await Promise.all(
      results.map(async (result: any) => {
        const detailResponse = await axios.get(WIKIPEDIA_API_URL, {
          params: {
            action: 'query',
            format: 'json',
            pageids: result.pageid,
            prop: 'extracts|info',
            exintro: true,
            explaintext: true,
            inprop: 'url',
            origin: '*'
          }
        });

        const page = detailResponse.data.query.pages[result.pageid];
        return {
          title: page.title,
          extract: page.extract,
          url: page.fullurl
        };
      })
    );

    return detailedResults;
  } catch (error) {
    console.error(`Error fetching Wikipedia ${category} data:`, error);
    return [];
  }
};

export const fetchWikipediaEvents = async (date: string): Promise<WikipediaData> => {
  try {
    const [news, finance, culture, tech, entertainment] = await Promise.all([
      fetchWikipediaCategory(date, 'news events'),
      fetchWikipediaCategory(date, 'financial history'),
      fetchWikipediaCategory(date, 'cultural history'),
      fetchWikipediaCategory(date, 'technology history'),
      fetchWikipediaCategory(date, 'entertainment history')
    ]);

    return {
      news,
      finance,
      culture,
      tech,
      entertainment,
      timestamp: date
    };
  } catch (error) {
    console.error('Error fetching Wikipedia events:', error);
    return {
      news: [],
      finance: [],
      culture: [],
      tech: [],
      entertainment: [],
      timestamp: date
    };
  }
};

export const fetchStockData = async (symbol: string, date: string) => {
  try {
    const response = await axios.get(ALPHA_VANTAGE_API_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      }
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
        volume: timeSeriesData[formattedDate]['5. volume']
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};