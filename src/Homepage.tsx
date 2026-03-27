// Homepage.tsx - Complete with Tabs & Real Videos
import { useState } from "react";
import SearchBox from "./components/ui/SearchBox";
import PropertySlider from "./components/ui/PropertySlider";
import Vid from "./assests/vid.mp4";
import {
  Home,
  Building2,
  Heart,
  TrendingUp,
  Play,
  MapPin,
  Star,
} from "lucide-react";

function Homepage() {
  const [activePropertyTab, setActivePropertyTab] = useState("all");
  const [activeVideo, setActiveVideo] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Real property data with tabs
  const allProperties = [
    {
      id: 1,
      title: "Modern Downtown Loft",
      price: 450000,
      location: "Downtown, New York",
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      isForRent: false,
      category: "apartment",
      rating: 4.8,
      featured: true,
    },
    {
      id: 2,
      title: "Luxury Beachfront Villa",
      price: 8500,
      location: "Malibu, California",
      imageUrl:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      isForRent: true,
      category: "villa",
      rating: 4.9,
      featured: true,
    },
    {
      id: 3,
      title: "Cozy Suburban Home",
      price: 320000,
      location: "Austin, Texas",
      imageUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      isForRent: false,
      category: "house",
      rating: 4.7,
      featured: false,
    },
    {
      id: 4,
      title: "Penthouse with City View",
      price: 12000,
      location: "Manhattan, NY",
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      isForRent: true,
      category: "penthouse",
      rating: 4.9,
      featured: true,
    },
    {
      id: 5,
      title: "Minimalist Studio",
      price: 1800,
      location: "San Francisco, CA",
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      bedrooms: 1,
      bathrooms: 1,
      area: 550,
      isForRent: true,
      category: "studio",
      rating: 4.6,
      featured: false,
    },
    {
      id: 6,
      title: "Mountain View Cabin",
      price: 380000,
      location: "Denver, Colorado",
      imageUrl:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      isForRent: false,
      category: "cabin",
      rating: 4.8,
      featured: true,
    },
    {
      id: 7,
      title: "Urban Industrial Loft",
      price: 525000,
      location: "Brooklyn, NY",
      imageUrl:
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400",
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      isForRent: false,
      category: "apartment",
      rating: 4.7,
      featured: false,
    },
    {
      id: 8,
      title: "Mediterranean Villa",
      price: 12000,
      location: "Santa Barbara, CA",
      imageUrl:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      isForRent: true,
      category: "villa",
      rating: 5.0,
      featured: true,
    },
  ];

  const filteredProperties =
    activePropertyTab === "all"
      ? allProperties
      : allProperties.filter((p) => p.category === activePropertyTab);

  const featuredProperties = allProperties.filter((p) => p.featured);

  // Real Instagram-style videos
  const realVideos = [
    {
      id: 1,
      url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-1212-large.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
      title: "Modern Apartment Tour",
      views: "2.3M",
      likes: "45K",
      platform: "instagram",
    },
    {
      id: 2,
      url: "https://assets.mixkit.co/videos/preview/mixkit-luxury-villa-poolside-1213-large.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600",
      title: "Luxury Villa Experience",
      views: "1.8M",
      likes: "32K",
      platform: "youtube",
    },
    {
      id: 3,
      url: "https://assets.mixkit.co/videos/preview/mixkit-cozy-living-room-with-fireplace-1214-large.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
      title: "Cozy Home Vibes",
      views: "3.1M",
      likes: "67K",
      platform: "instagram",
    },
    {
      id: 4,
      url: "https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-design-1215-large.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
      title: "Designer Kitchen",
      views: "1.2M",
      likes: "28K",
      platform: "tiktok",
    },
  ];

  const categories = [
    { id: "all", label: "All Properties", icon: Home },
    { id: "apartment", label: "Apartments", icon: Building2 },
    { id: "villa", label: "Villas", icon: Home },
    { id: "house", label: "Houses", icon: Building2 },
    { id: "studio", label: "Studios", icon: Home },
    { id: "penthouse", label: "Penthouses", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <video
          src={Vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-1"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4">
            Driftx
          </h1>

          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mt-4 max-w-2xl mx-auto leading-relaxed">
            Discover exceptional properties tailored to your lifestyle
          </p>

          <div className="mt-8 w-full max-w-2xl mx-auto">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Handpicked selections just for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              🌟 {featuredProperties.length} Featured
            </span>
          </div>
        </div>

        <PropertySlider properties={featuredProperties} title="" subtitle="" />
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap gap-2 sm:gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActivePropertyTab(category.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                  activePropertyTab === category.id
                    ? "bg-[#0f084b] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <category.icon size={16} />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {property.featured && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-white text-sm font-bold">
                    ${property.price.toLocaleString()}
                    {property.isForRent && <span className="text-xs">/mo</span>}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                  <MapPin size={12} />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {property.rating}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-3 text-black text-sm font-medium ">
            View All Properties
          </button>
        </div>
      </div>

      {/* Video Grid Section */}
      <div className="bg-gray-100 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Experience the Lifestyle
            </h2>
            <p className="text-gray-600">
              See how our clients live in their dream spaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realVideos.map((video, index) => (
              <div
                key={video.id}
                className="group relative rounded-xl overflow-hidden bg-gray-900 aspect-square cursor-pointer"
                onClick={() => setActiveVideo(index)}
              >
                <video
                  src={video.url}
                  poster={video.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loop
                  muted
                  autoPlay={activeVideo === index && isVideoPlaying}
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-semibold">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-3 text-white/70 text-xs mt-1">
                    <span>{video.views} views</span>
                    <span>❤️ {video.likes}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default Homepage;
