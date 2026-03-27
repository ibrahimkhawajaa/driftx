import React, { useState, useEffect } from "react"
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

const SearchBox: React.FC = () => {
  const [beds, setBeds] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [kitchen, setKitchen] = useState(0)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

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

  const handleApply = () => {
    setIsPopupOpen(false)
  }

  const handleClear = () => {
    setBeds(1)
    setBathrooms(1)
    setKitchen(0)
  }

  // Animated counter effect
  const [animateBeds, setAnimateBeds] = useState(false)
  const [animateBath, setAnimateBath] = useState(false)
  const [animateKitchen, setAnimateKitchen] = useState(false)

  useEffect(() => {
    if (animateBeds) setTimeout(() => setAnimateBeds(false), 200)
    if (animateBath) setTimeout(() => setAnimateBath(false), 200)
    if (animateKitchen) setTimeout(() => setAnimateKitchen(false), 200)
  }, [animateBeds, animateBath, animateKitchen])

  const totalSelectedCount = (beds > 1 ? 1 : 0) + (bathrooms > 1 ? 1 : 0) + (kitchen > 0 ? 1 : 0)

  return (
    <div className="mx-auto   px-4 relative o">
      {/* Main Search Bar */}
      <div className="group relative">
        <div className="relative flex items-center overflow-hidden rounded-full border border-gray-200/80 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* Search Icon */}
          <div className="pl-5">
            <Search size={20} className="text-[#0f084b]" strokeWidth={1.8} />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search for your dream space..."
            className="h-[52px] flex-1 bg-transparent px-3 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
          />

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200"></div>

          {/* Amenities Button */}
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="group/amenity flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex -space-x-1">
                  <Bed size={16} className="text-[#0f084b]" />
                  <Bath size={16} className="text-[#0f084b]" />
                  {kitchen > 0 && (
                    <Coffee size={16} className="text-[#0f084b]" />
                  )}
                </div>
                {totalSelectedCount > 0 && (
                  <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0f084b] text-[10px] font-bold text-white">
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
        </div>
      </div>

      {/* Compact Popup - 300px width from bottom */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsPopupOpen(false)}
          />
          
          {/* Popup Panel - 300px width */}
          <div className="relative w-[300px] animate-slide-up rounded-t-2xl bg-white shadow-2xl">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-gray-300"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3">
              <h3 className="text-base font-semibold text-gray-900">Room Settings</h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Counters */}
            <div className="space-y-5 p-5">
              {/* Bedrooms Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f084b]/10">
                    <Bed size={18} className="text-[#0f084b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Bedrooms</p>
                    <p className="text-xs text-gray-400">Restful spaces</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => decrement(setBeds, beds)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span className={`w-8 text-center text-xl font-bold text-[#0f084b] transition-all ${animateBeds ? "scale-125" : ""}`}>
                    {beds}
                  </span>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => increment(setBeds, beds)}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Bathrooms Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f084b]/10">
                    <Bath size={18} className="text-[#0f084b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Bathrooms</p>
                    <p className="text-xs text-gray-400">Spa-like retreats</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => decrement(setBathrooms, bathrooms)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span className={`w-8 text-center text-xl font-bold text-[#0f084b] transition-all ${animateBath ? "scale-125" : ""}`}>
                    {bathrooms}
                  </span>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => increment(setBathrooms, bathrooms)}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Kitchen Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f084b]/10">
                    <Coffee size={18} className="text-[#0f084b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Kitchen</p>
                    <p className="text-xs text-gray-400">Chef-inspired cooking</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => decrement(setKitchen, kitchen)}
                  >
                    <Minus size={14} className="text-gray-500" />
                  </button>
                  <span className={`w-8 text-center text-xl font-bold text-[#0f084b] transition-all ${animateKitchen ? "scale-125" : ""}`}>
                    {kitchen}
                  </span>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all hover:border-[#0f084b] hover:bg-[#0f084b]/5 active:scale-95"
                    onClick={() => increment(setKitchen, kitchen)}
                  >
                    <Plus size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 border-t border-gray-100 p-4">
              <button
                onClick={handleClear}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-all hover:border-[#0f084b] hover:text-[#0f084b]"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-lg bg-[#0f084b] py-2 text-sm font-medium text-white transition-all hover:bg-[#1a1268] hover:shadow-md"
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