import { useEffect, useState, useMemo, startTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Star, Heart } from "lucide-react";
import SearchBox from "../components/ui/SearchBox";
import { fetchProperties } from "../lib/api";
import type { Property } from "../types/property";
import PropertyShowcaseModal from "../components/PropertyShowcaseModal";
import Photo from "../assests/search.jpg";
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);

  const queryKey = searchParams.toString();

  const filters = useMemo(() => {
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const minBeds = searchParams.get("minBeds");
    const minBaths = searchParams.get("minBaths");
    const hasKitchen = searchParams.get("hasKitchen");
    const isForRent = searchParams.get("isForRent");
    return {
      q,
      category: category === "all" ? undefined : category,
      minBeds: minBeds ? Number(minBeds) : undefined,
      minBaths: minBaths ? Number(minBaths) : undefined,
      hasKitchen: hasKitchen === "true" ? true : undefined,
      isForRent:
        isForRent === "true" ? true : isForRent === "false" ? false : undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    fetchProperties({ ...filters, limit: 100 })
      .then((data) => {
        if (!cancelled) setList(data);
      })
      .catch(() => {
        if (!cancelled)
          setErr("Could not load properties. Is the API running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  const openProperty = (id: string | number) => {
    const property = list.find((item) => String(item.id) === String(id));
    if (property) startTransition(() => setSelected(property));
  };

  return (
    <div className="min-h-screen ">
      <div className="relative overflow-hidden px-3 py-12 sm:px-4 sm:py-20 md:py-24 lg:py-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat "
          style={{
            backgroundImage: `url(${Photo})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />

        {/* Content */}
        <div className="relative z-20 mx-auto max-w-4xl px-2 sm:px-4">
          <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            Find your perfect stay
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-100 sm:mt-3 sm:text-base">
            Browse our premium property collection
          </p>
          <div className="mt-5 sm:mt-8">
            <SearchBox variant="page" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#606c38]"></div>
            <p className="mt-4 text-gray-500">Loading listings…</p>
          </div>
        )}
        {err && (
          <div className="rounded-lg bg-red-50 px-4 py-4">
            <p className="text-sm font-medium text-red-800">{err}</p>
          </div>
        )}
        {!loading && !err && list.length === 0 && (
          <div className="rounded-lg bg-blue-50 px-6 py-8 text-center">
            <p className="text-sm text-blue-700">
              No properties match your filters. Try adjusting your search
              criteria or explore all listings.
            </p>
          </div>
        )}

        {list.length > 0 && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Available Properties
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Showing <span className="font-semibold">{list.length}</span>{" "}
                  properties
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              {list.map((property, idx) => (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => startTransition(() => setSelected(property))}
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
          </>
        )}
      </div>

      <PropertyShowcaseModal
        property={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
