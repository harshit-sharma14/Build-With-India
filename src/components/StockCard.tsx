import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { StockData } from '../api';

interface StockCardProps {
  stock: StockData;
  symbol: string;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, symbol }) => {
  const priceChange = parseFloat(stock.close) - parseFloat(stock.open);
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold">{symbol}</h3>
        </div>
        <span className="text-sm text-gray-400">{stock.date}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Open</p>
          <p className="text-lg">${parseFloat(stock.open).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Close</p>
          <p className="text-lg">${parseFloat(stock.close).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">High</p>
          <p className="text-lg">${parseFloat(stock.high).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Low</p>
          <p className="text-lg">${parseFloat(stock.low).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUp className="text-green-500 mr-2" />
        ) : (
          <ArrowDown className="text-red-500 mr-2" />
        )}
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          ${Math.abs(priceChange).toFixed(2)} ({((priceChange / parseFloat(stock.open)) * 100).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};