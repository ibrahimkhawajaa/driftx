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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative overflow-hidden px-4 py-20 sm:py-24 md:py-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${Photo})`,
           backgroundPosition: "center 10%", // Shows the middle part
            backgroundSize: "fit", // or "contain" depending on your needs
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-black/50" />

        {/* Content */}
        <div className="relative z-20 mx-auto max-w-5xl">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Find your perfect stay
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-100 sm:text-lg">
            Browse our curated collection of premium properties and find exactly
            what you're looking for
          </p>
          <div className="mt-8">
            <SearchBox variant="page" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#0f084b]"></div>
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((property) => (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => startTransition(() => setSelected(property))}
                  className="group overflow-hidden rounded-xl bg-white text-left shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={property.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                    {property.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-0.5 text-xs font-bold text-black">
                        Featured
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-sm font-bold text-white backdrop-blur-sm">
                      ${property.price.toLocaleString()}
                      {property.isForRent && (
                        <span className="text-xs font-normal">/mo</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="line-clamp-1 font-semibold text-gray-900">
                      {property.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      {property.location}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>
                        {property.bedrooms} beds · {property.bathrooms} baths ·{" "}
                        {property.area} sqft
                      </span>
                      {property.rating != null && (
                        <span className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {property.rating}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Heart
                        size={18}
                        className="text-gray-400 transition-colors group-hover:text-red-500"
                        aria-hidden
                      />
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
