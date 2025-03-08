import React from 'react';
import { CategoryData } from '../api';
import { ExternalLink } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  data: CategoryData[];
  icon: React.ReactNode;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ title, data, icon }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
            <div className="flex items-start justify-between">
              <h4 className="text-lg font-medium text-blue-400">{item.title}</h4>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            <p className="text-gray-300 mt-2 line-clamp-3">{item.extract}</p>
          </div>
        ))}
      </div>
    </div>
  );
};