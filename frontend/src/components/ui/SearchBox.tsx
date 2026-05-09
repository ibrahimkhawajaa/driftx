import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import {
  Search,
  Bed,
  Bath,
  Coffee,
  X,
  ChevronUp,
  Plus,
  Minus,
} from "lucide-react"

type Variant = "hero" | "page"

interface SearchBoxProps {
  variant?: Variant
}

const accent = "#606c38"

const SearchBox: React.FC<SearchBoxProps> = ({ variant = "hero" }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState("")
  const [beds, setBeds] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [kitchen, setKitchen] = useState(0)
  const [category, setCategory] = useState("all")
  const [rentFilter, setRentFilter] = useState<"any" | "rent" | "sale">("any")
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    if (location.pathname !== "/search") return
    setQuery(searchParams.get("q") || "")
    const b = searchParams.get("minBeds")
    const bt = searchParams.get("minBaths")
    setBeds(b ? Math.max(0, Number(b)) : 1)
    setBathrooms(bt ? Math.max(0, Number(bt)) : 1)
    setKitchen(searchParams.get("hasKitchen") === "true" ? 1 : 0)
    setCategory(searchParams.get("category") || "all")
    const ir = searchParams.get("isForRent")
    if (ir === "true") setRentFilter("rent")
    else if (ir === "false") setRentFilter("sale")
    else setRentFilter("any")
  }, [location.pathname, searchParams])

  const increment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    max: number = 10
  ) => {
    if (value < max) setter(value + 1)
  }

  const decrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    if (value > 0) setter(value - 1)
  }

  const getAmenitiesText = () => {
    const amenitiesList = []
    if (beds > 0) amenitiesList.push(`${beds} bed${beds > 1 ? "s" : ""}`)
    if (bathrooms > 0)
      amenitiesList.push(`${bathrooms} bath${bathrooms > 1 ? "s" : ""}`)
    if (kitchen > 0) amenitiesList.push(`kitchen`)
    return amenitiesList.length > 0
      ? amenitiesList.join(" • ")
      : "Select amenities"
  }

  const buildParams = () => {
    const p = new URLSearchParams()
    if (query.trim()) p.set("q", query.trim())
    if (beds > 0) p.set("minBeds", String(beds))
    if (bathrooms > 0) p.set("minBaths", String(bathrooms))
    if (kitchen > 0) p.set("hasKitchen", "true")
    if (category && category !== "all") p.set("category", category)
    if (rentFilter === "rent") p.set("isForRent", "true")
    if (rentFilter === "sale") p.set("isForRent", "false")
    return p
  }

  const goSearch = () => {
    navigate(`/search?${buildParams().toString()}`)
  }

  const handleApply = () => {
    setIsPopupOpen(false)
    if (variant === "page" || location.pathname === "/search") goSearch()
  }

  const handleClear = () => {
    setBeds(1)
    setBathrooms(1)
    setKitchen(0)
    setCategory("all")
    setRentFilter("any")
  }

  const [animateBeds, setAnimateBeds] = useState(false)
  const [animateBath, setAnimateBath] = useState(false)
  const [animateKitchen, setAnimateKitchen] = useState(false)

  useEffect(() => {
    if (animateBeds) setTimeout(() => setAnimateBeds(false), 200)
    if (animateBath) setTimeout(() => setAnimateBath(false), 200)
    if (animateKitchen) setTimeout(() => setAnimateKitchen(false), 200)
  }, [animateBeds, animateBath, animateKitchen])

  const totalSelectedCount =
    (beds > 1 ? 1 : 0) + (bathrooms > 1 ? 1 : 0) + (kitchen > 0 ? 1 : 0)

  return (
    <div className="relative mx-auto px-4">
      <div className="group relative">
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg transition-all duration-300 hover:shadow-xl sm:flex-row sm:items-center sm:rounded-full">
          <div className="flex min-h-[52px] flex-1 items-center">
            <div className="pl-5">
              <Search size={20} style={{ color: accent }} strokeWidth={1.8} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
              placeholder="Search for your dream space..."
              className="h-[52px] flex-1 bg-transparent px-3 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="hidden h-6 w-px bg-gray-200 sm:block" />

          <div className="flex items-center gap-2 px-2 pb-2 sm:pb-0 sm:pr-2">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="group/amenity flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 transition-all duration-300 hover:bg-gray-50 sm:flex-initial"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="flex -space-x-1">
                    <Bed size={16} style={{ color: accent }} />
                    <Bath size={16} style={{ color: accent }} />
                    {kitchen > 0 && (
                      <Coffee size={16} style={{ color: accent }} />
                    )}
                  </div>
                  {totalSelectedCount > 0 && (
                    <span
                      className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {totalSelectedCount}
                    </span>
                  )}
                </div>
                <span className="hidden max-w-[150px] truncate text-xs font-medium text-gray-600 sm:inline">
                  {getAmenitiesText()}
                </span>
              </div>
              <ChevronUp size={14} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={goSearch}
              className="shrink-0 rounded-full bg-[#606c38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a1268]"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsPopupOpen(false)}
          />

          <div className="relative max-h-[90vh] w-full max-w-[360px] animate-slide-up overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex justify-center pb-2 pt-3 sm:hidden">
              <div className="h-1 w-12 rounded-full bg-gray-300"></div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3">
              <h3 className="text-base font-semibold text-gray-900">Filters</h3>
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">Category</p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#606c38]"
                >
                  <option value="all">All</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="cabin">Cabin</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">
                  Listing type
                </p>
                <div className="flex gap-2">
                  {(
                    [
                      ["any", "Any"],
                      ["rent", "Rent"],
                      ["sale", "Sale"],
                    ] as const
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRentFilter(v)}
                      className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                        rentFilter === v
                          ? "border-[#606c38] bg-[#606c38] text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606c38]/10">
                    <Bed size={18} className="text-[#606c38]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Bedrooms</p>
                    <p className="text-xs text-gray-400">Minimum</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => decrement(setBeds, beds)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span
                    className={`w-8 text-center text-xl font-bold text-[#606c38] transition-all ${animateBeds ? "scale-125" : ""}`}
                  >
                    {beds}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => {
                      increment(setBeds, beds)
                      setAnimateBeds(true)
                    }}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606c38]/10">
                    <Bath size={18} className="text-[#606c38]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Bathrooms</p>
                    <p className="text-xs text-gray-400">Minimum</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => decrement(setBathrooms, bathrooms)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span
                    className={`w-8 text-center text-xl font-bold text-[#606c38] transition-all ${animateBath ? "scale-125" : ""}`}
                  >
                    {bathrooms}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => {
                      increment(setBathrooms, bathrooms)
                      setAnimateBath(true)
                    }}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606c38]/10">
                    <Coffee size={18} className="text-[#606c38]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Kitchen</p>
                    <p className="text-xs text-gray-400">Prefer kitchen</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => decrement(setKitchen, kitchen)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span
                    className={`w-8 text-center text-xl font-bold text-[#606c38] transition-all ${animateKitchen ? "scale-125" : ""}`}
                  >
                    {kitchen}
                  </span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#606c38] hover:bg-[#606c38]/5 active:scale-95"
                    onClick={() => {
                      increment(setKitchen, kitchen, 1)
                      setAnimateKitchen(true)
                    }}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-all hover:border-[#606c38] hover:text-[#606c38]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded-lg bg-[#606c38] py-2 text-sm font-medium text-white transition-all hover:bg-[#1a1268] hover:shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SearchBox
