import React from 'react';
import { Calendar } from 'lucide-react';

interface EventCardProps {
  date: string;
  title: string;
  description: string;
  image?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ date, title, description, image }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center text-sm text-blue-400 mb-2">
          <Calendar size={16} className="mr-2" />
          {date}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};