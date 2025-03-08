import React, { useState } from 'react';
import { Calendar, Clock, Search, Newspaper, TrendingUp, Radio, Smartphone, Film } from 'lucide-react';
import useSWR from 'swr';
import { fetchWikipediaEvents, fetchStockData, WikipediaData, StockData } from './api';
import { EventCard } from './components/EventCard';
import { StockCard } from './components/StockCard';
import { CategorySection } from './components/CategorySection';

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: wikiData } = useSWR<WikipediaData | null>(
    isSearching ? ['wikipedia', selectedDate] : null,
    () => fetchWikipediaEvents(selectedDate)
  );

  const { data: stockData } = useSWR<StockData | null>(
    isSearching ? ['stock', selectedDate] : null,
    () => fetchStockData('AAPL', selectedDate)
  );
  
  const categories = [
    { icon: <Newspaper size={24} />, name: 'News', color: 'bg-blue-500' },
    { icon: <TrendingUp size={24} />, name: 'Finance', color: 'bg-green-500' },
    { icon: <Radio size={24} />, name: 'Culture', color: 'bg-purple-500' },
    { icon: <Smartphone size={24} />, name: 'Tech', color: 'bg-orange-500' },
    { icon: <Film size={24} />, name: 'Entertainment', color: 'bg-red-500' }
  ];

  const trendingEvents = [
    {
      date: 'August 9, 1995',
      title: 'Netscape IPO',
      description: 'The day the internet went mainstream',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80'
    },
    {
      date: 'January 9, 2007',
      title: 'iPhone Launch',
      description: 'Steve Jobs introduces the first iPhone',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80'
    },
    {
      date: 'November 10, 1989',
      title: 'Berlin Wall Falls',
      description: 'A pivotal moment in world history',
      image: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleSearch = () => {
    if (selectedDate) {
      setIsSearching(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Time Travel Search Engine
          </h1>
          <p className="text-xl text-gray-300">
            Explore history as if you were there
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <Calendar className="text-gray-400 mr-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
              placeholder="Select a date..."
            />
            <button 
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
            >
              <Search className="mr-2" />
              Explore
            </button>
          </div>
        </div>

        {/* Search Results */}
        {isSearching && wikiData && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8">Results for {selectedDate}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* News Section */}
              <CategorySection
                title="News"
                data={wikiData.news}
                icon={<Newspaper className="text-blue-400" size={24} />}
              />
              
              {/* Finance Section */}
              <div className="space-y-8">
                <CategorySection
                  title="Finance"
                  data={wikiData.finance}
                  icon={<TrendingUp className="text-green-400" size={24} />}
                />
                {stockData && <StockCard stock={stockData} symbol="AAPL" />}
              </div>

              {/* Culture Section */}
              <CategorySection
                title="Culture"
                data={wikiData.culture}
                icon={<Radio className="text-purple-400" size={24} />}
              />

              {/* Tech Section */}
              <CategorySection
                title="Technology"
                data={wikiData.tech}
                icon={<Smartphone className="text-orange-400" size={24} />}
              />

              {/* Entertainment Section */}
              <CategorySection
                title="Entertainment"
                data={wikiData.entertainment}
                icon={<Film className="text-red-400" size={24} />}
              />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mt-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${category.color} p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center space-y-2`}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Trending Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Trending Time Travels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingEvents.map((event, index) => (
              <EventCard
                key={index}
                date={event.date}
                title={event.title}
                description={event.description}
                image={event.image}
              />
            ))}
          </div>
        </div>

        {/* Real-time Clock */}
        <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-lg rounded-full p-4 flex items-center space-x-2">
          <Clock className="text-blue-400" />
          <span className="text-sm">Time Machine Ready</span>
        </div>
      </div>
    </div>
  );
}

export default App;