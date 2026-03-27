// Card.tsx - Compact Version
import React from 'react';
import { Bed, Bath, Square, MapPin, Heart} from 'lucide-react';

interface CardProps {
  id: string | number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isForRent?: boolean;
  onContact?: (id: string | number) => void;
  onFavorite?: (id: string | number) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  price,
  location,
  imageUrl,
  bedrooms,
  bathrooms,
  area,
  isForRent = false,
  onContact,
  onFavorite,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative w-80 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Property';
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
          <p className="text-white font-bold text-sm">
            {formatPrice(price)}
            {isForRent && <span className="text-xs">/mo</span>}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(id)}
          className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white transition-all hover:scale-110"
        >
          <Heart size={14} className="text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin size={12} />
          <p className="text-xs line-clamp-1">{location}</p>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Bed size={12} className="text-gray-600" />
            <span className="text-gray-700">{bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={12} className="text-gray-600" />
            <span className="text-gray-700">{bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={12} className="text-gray-600" />
            <span className="text-gray-700">{area} sqft</span>
          </div>
        </div>

        {/* Contact Button */}
        <button
          onClick={() => onContact?.(id)}
          className="w-full bg-[#0f084b]  text-white text-xs font-medium py-2 rounded-lg hover:shadow-md transition-all hover:scale-[1.02]"
        >
          Contact Agent
        </button>
      </div>
    </div>
  );
};

export default Card;