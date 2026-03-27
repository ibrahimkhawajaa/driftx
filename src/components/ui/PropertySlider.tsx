// PropertySlider.tsx - Horizontal Slider Component
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';

interface Property {
  id: string | number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isForRent?: boolean;
}

interface PropertySliderProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
}

const PropertySlider: React.FC<PropertySliderProps> = ({
  properties,
  title = "Latest Properties",
  subtitle = "Handpicked selections just for you"
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContact = (id: string | number) => {
    console.log(`Contact about property ${id}`);
    // Implement contact functionality
  };

  const handleFavorite = (id: string | number) => {
    console.log(`Added property ${id} to favorites`);
    // Implement favorite functionality
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            aria-label="Previous properties"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            aria-label="Next properties"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <div key={property.id} className="snap-start">
            <Card
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              imageUrl={property.imageUrl}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              isForRent={property.isForRent}
              onContact={handleContact}
              onFavorite={handleFavorite}
            />
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PropertySlider;