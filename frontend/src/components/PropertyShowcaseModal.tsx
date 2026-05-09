import { useEffect, useState, memo, type FormEvent } from "react"
import { X, MapPin, Bed, Bath, Square, Star, Copy, Check } from "lucide-react"
import type { Property } from "../types/property"

interface Props {
  property: Property | null
  onClose: () => void
}

function PropertyShowcaseModal({ property, onClose }: Props) {
  useEffect(() => {
    if (!property) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [property, onClose])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!property) return null

  const gallery = [
    property.imageUrl,
    ...(property.images || []).filter((u) => u && u !== property.imageUrl),
  ].filter(Boolean)

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(n)

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("sending")
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyId: property.id,
          propertyTitle: property.title,
          message,
        }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error((payload as { error?: string }).error || "Failed to send message")
      }

      setStatus("success")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Failed to send message")
    }
  }

  const copyPropertyName = () => {
    navigator.clipboard.writeText(property!.title)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[95vh] w-full max-w-3xl flex-col overflow-y-auto rounded-t-2xl border border-[#606c38]/30 bg-white shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcase-title"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 bg-gray-100 sm:aspect-[21/9]">
          <img
            src={gallery[0]}
            alt=""
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://picsum.photos/1200/600?random=1"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 transition hover:bg-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#606c38]">
              {property.isForRent ? "For rent" : "For sale"}
              {property.category ? ` · ${property.category}` : ""}
            </p>
            <div className="mt-1 flex items-start justify-between gap-3">
              <div className="flex-1">
                <h2
                  id="showcase-title"
                  className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl"
                >
                  {property.title}
                </h2>
              </div>
              <button
                onClick={copyPropertyName}
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-white"
                title="Copy property name"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-[#606c38]" />
                {property.location}
              </span>
              {property.rating != null && (
                <span className="flex items-center gap-1">
                  <Star size={16} className="fill-[#606c38] text-[#606c38]" />
                  {property.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-600">
              Photo Gallery
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((src) => (
                <button
                  key={src}
                  onClick={() => setFullscreenImage(src)}
                  className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-gray-300 transition hover:ring-[#606c38]"
                  type="button"
                  aria-label="View fullscreen"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <p className="text-2xl font-semibold text-[#606c38] sm:text-3xl">
            {formatPrice(property.price)}
            {property.isForRent && (
              <span className="text-base font-normal text-gray-600">/mo</span>
            )}
          </p>

          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-4 sm:flex sm:flex-wrap text-xs sm:text-sm text-gray-700">
            <span className="flex items-center gap-1 sm:gap-2">
              <Bed size={16} className="text-[#606c38] sm:scale-125" />
              <span className="line-clamp-1">{property.bedrooms} <span className="hidden sm:inline">bedrooms</span><span className="sm:hidden">bed</span></span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <Bath size={16} className="text-[#606c38] sm:scale-125" />
              <span className="line-clamp-1">{property.bathrooms} <span className="hidden sm:inline">bathrooms</span><span className="sm:hidden">bath</span></span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <Square size={16} className="text-[#606c38] sm:scale-125" />
              <span className="line-clamp-1">{property.area} sqft</span>
            </span>
          </div>

          {property.description ? (
            <p className="mt-6 leading-relaxed text-gray-700">
              {property.description}
            </p>
          ) : (
            <p className="mt-6 text-gray-500">
              Discover this curated Monarque Stays residence—details available on
              request.
            </p>
          )}

          <div className="mt-6 sm:mt-10 rounded-2xl border border-[#606c38]/20 bg-gradient-to-br from-[#606c38]/5 via-white to-[#daa520]/5 p-4 sm:p-8 shadow-lg">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#606c38]">
                  Get in touch
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  Interested in {property.title}?
                </h3>
              </div>
              <span className="shrink-0 rounded-full bg-[#606c38] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md whitespace-nowrap">
                Request
              </span>
            </div>
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Fill out the form and our team will contact you shortly.
            </p>

            <form onSubmit={submitContact} className="space-y-3 sm:space-y-4">
              {status === "success" && (
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white">✓</div>
                  <div>Your message has been sent successfully! We'll be in touch shortly.</div>
                </div>
              )}
              {error && (
                <div className="rounded-xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-rose-500 flex items-center justify-center text-white">!</div>
                  <div>{error}</div>
                </div>
              )}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
                <label className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900 block">Full Name *</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-500 transition focus:border-[#606c38] focus:outline-none focus:ring-2 focus:ring-[#606c38]/20 min-h-[44px] sm:min-h-auto"
                    placeholder="John Doe"
                  />
                </label>
                <label className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900 block">Email Address *</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-500 transition focus:border-[#606c38] focus:outline-none focus:ring-2 focus:ring-[#606c38]/20 min-h-[44px] sm:min-h-auto"
                    placeholder="john@example.com"
                  />
                </label>
                <label className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900 block">Phone Number *</span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-500 transition focus:border-[#606c38] focus:outline-none focus:ring-2 focus:ring-[#606c38]/20 min-h-[44px] sm:min-h-auto"
                    placeholder="+1 (555) 123-4567"
                  />
                </label>
                <label className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold text-gray-900 block">Property</span>
                  <input
                    readOnly
                    value={property.title}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-600 cursor-not-allowed min-h-[44px] sm:min-h-auto"
                  />
                </label>
              </div>
              <label className="space-y-2 text-xs sm:text-sm text-gray-700">
                <span className="font-semibold text-gray-900 block">Message (Optional)</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-500 transition resize-none focus:border-[#606c38] focus:outline-none focus:ring-2 focus:ring-[#606c38]/20 min-h-[100px] sm:min-h-auto"
                  placeholder="Tell us more about this property..."
                />
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg bg-gradient-to-r from-[#606c38] to-[#7a8a4a] px-4 sm:px-6 py-3 text-sm font-bold text-white transition hover:shadow-lg hover:from-[#566231] hover:to-[#6d7d3d] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-md mt-2 min-h-[44px] sm:min-h-auto"
              >
                {status === "sending" ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Sending…
                  </span>
                ) : (
                  "Send Inquiry"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black">
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close fullscreen"
          >
            <X size={28} />
          </button>
          <img
            src={fullscreenImage}
            alt=""
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "https://picsum.photos/1200/800?random=2"
            }}
          />
        </div>
      )}
    </div>
  )
}

export default memo(PropertyShowcaseModal)
