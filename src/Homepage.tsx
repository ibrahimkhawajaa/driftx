import { useEffect, useState, startTransition } from "react";
import SearchBox from "./components/ui/SearchBox";
import PropertySlider from "./components/ui/PropertySlider";
import PropertyShowcaseModal from "./components/PropertyShowcaseModal";
import { fetchProperties } from "./lib/api";
import type { Property } from "./types/property";
import Vid from "./assests/vid.mp4";
import {
  Home,
  Building2,
  Heart,
  TrendingUp,
  Play,
  MapPin,
  Star,
  Video,
} from "lucide-react";

function Homepage() {
  const [activePropertyTab, setActivePropertyTab] = useState("all");
  const [activeVideo, setActiveVideo] = useState(0);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);
  const [lifestyleClip, setLifestyleClip] = useState<number | null>(null);

  // useEffect(() => {
  //   fetchProperties({ limit: 80 })
  //     .then(setAllProperties)
  //     .catch(() => setLoadError("Could not load listings. Start the API and MongoDB."))
  // }, [])

  const filteredProperties =
    activePropertyTab === "all"
      ? allProperties
      : allProperties.filter((p) => p.category === activePropertyTab);

  const featuredProperties = allProperties.filter((p) => p.featured);

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

  const openById = (id: string | number) => {
    const p = allProperties.find((x) => String(x.id) === String(id));
    if (p) startTransition(() => setSelected(p));
  };

  const openPropertyCard = (p: Property) => {
    startTransition(() => setSelected(p));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <video
          src={Vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <img
            src="/logo-monarque.png"
            alt="Monarque Stays"
            className="mb-4 h-24 w-auto object-contain sm:h-28"
          />

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl md:text-2xl">
            Discover exceptional properties tailored to your lifestyle
          </p>

          <div className="mx-auto mt-8 w-full max-w-2xl">
            <SearchBox variant="hero" />
          </div>
        </div>
      </div>

      {loadError && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          {loadError}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked selections just for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {featuredProperties.length} Featured
            </span>
          </div>
        </div>

        {featuredProperties.length > 0 ? (
          <PropertySlider
            properties={featuredProperties}
            title=""
            subtitle=""
            onPropertyClick={openById}
          />
        ) : (
          <p className="text-sm text-gray-500">
            No featured listings yet. Mark properties as featured in the admin
            panel.
          </p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActivePropertyTab(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  activePropertyTab === category.id
                    ? "bg-[#606c38] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <category.icon size={16} />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredProperties.map((property, idx) => (
            <button
              key={property.id}
              type="button"
              onClick={() => openPropertyCard(property)}
              className="group overflow-hidden rounded-xl bg-white text-left shadow-md transition-shadow duration-200 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.imageUrl}
                  alt=""
                  loading={idx < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {property.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#606c38] px-2 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/75 px-2 py-1">
                  <span className="text-sm font-bold text-white">
                    ${property.price.toLocaleString()}
                    {property.isForRent && <span className="text-xs">/mo</span>}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900">
                  {property.title}
                </h3>
                <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>{property.location}</span>
                </div>
                <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#606c38] text-[#606c38]" />
                    <span className="text-sm font-medium text-gray-700">
                      {property.rating ?? "—"}
                    </span>
                  </div>
                  <span
                    className="text-gray-400"
                    onClick={(e) => e.stopPropagation()}
                    role="presentation"
                  >
                    <Heart size={18} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Experience the Lifestyle
            </h2>
            <p className="text-gray-600">
              See how our clients live in their dream spaces
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {realVideos.map((video, index) => {
              const playing = lifestyleClip === index;
              return (
                <div
                  key={video.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-900"
                  onClick={() =>
                    setLifestyleClip((c) => (c === index ? null : index))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setLifestyleClip((c) => (c === index ? null : index));
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {playing && (
                    <video
                      key={`clip-${video.id}`}
                      className="absolute inset-0 z-10 h-full w-full object-cover"
                      src={video.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  )}
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${playing ? "opacity-0" : ""}`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white">
                      {video.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
                      <span>{video.views} views</span>
                      <span>{video.likes} likes</span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25">
                      <Play size={24} className="ml-1 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <PropertyShowcaseModal
        property={selected}
        onClose={() => setSelected(null)}
      />

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
