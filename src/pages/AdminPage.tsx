import { useEffect, useState, memo } from "react"
import { Trash2, Shield, ImagePlus, LogOut } from "lucide-react"
import { adminLogin, fetchProperties, createProperty, deleteProperty } from "../lib/api"
import type { Property } from "../types/property"

const STORAGE_TOKEN = "monarque_admin_token"

const PropertyItem = memo(({ property, onDelete }: { property: Property; onDelete: (id: string) => void }) => (
  <li className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
    <img src={property.imageUrl} alt="" className="h-12 w-16 rounded object-cover" loading="lazy" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-gray-900">{property.title}</p>
      <p className="truncate text-xs text-gray-600">{property.location}</p>
    </div>
    <button type="button" onClick={() => onDelete(property.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
      <Trash2 size={18} />
    </button>
  </li>
))
PropertyItem.displayName = "PropertyItem"

export default function AdminPage() {
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_TOKEN) || "" : ""
  )
  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")
  const [loginErr, setLoginErr] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const [list, setList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    bedrooms: "2",
    bathrooms: "2",
    area: "1200",
    isForRent: false,
    category: "apartment",
    featured: false,
    rating: "4.8",
    description: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])

  const load = () => {
    setLoading(true)
    fetchProperties()
      .then(setList)
      .catch(() => setErr("Failed to load properties"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (token) load()
    else setLoading(false)
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr(null)
    setLoginLoading(true)
    try {
      const { token: t } = await adminLogin(loginUser.trim(), loginPass)
      sessionStorage.setItem(STORAGE_TOKEN, t)
      setToken(t)
      setLoginPass("")
    } catch (e) {
      setLoginErr(e instanceof Error ? e.message : "Login failed")
    } finally {
      setLoginLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_TOKEN)
    setToken("")
    setList([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!token) {
      setErr("Sign in first.")
      return
    }
    if (!file) {
      setErr("Choose a cover image.")
      return
    }
    const fd = new FormData()
    fd.append("image", file)
    fd.append("title", form.title)
    fd.append("price", form.price)
    fd.append("location", form.location)
    fd.append("bedrooms", form.bedrooms)
    fd.append("bathrooms", form.bathrooms)
    fd.append("area", form.area)
    fd.append("isForRent", String(form.isForRent))
    fd.append("category", form.category)
    fd.append("featured", String(form.featured))
    fd.append("rating", form.rating)
    fd.append("description", form.description)

    try {
      additionalFiles.forEach((item) => fd.append("images", item))
      await createProperty(fd, token)
      setMsg("Property published.")
      setFile(null)
      setAdditionalFiles([])
      setForm((f) => ({
        ...f,
        title: "",
        price: "",
        location: "",
        description: "",
      }))
      load()
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this property?")) return
    try {
      await deleteProperty(id, token)
      load()
    } catch {
      setErr("Delete failed — sign in again if your session expired.")
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white px-4 py-10 text-gray-900">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex flex-col items-center gap-2">
            <img src="/logo-monarque.png" alt="Monarque Stays" className="h-16 w-auto object-contain" loading="lazy" />
            <h1 className="font-serif text-2xl text-[#0f084b]">Admin sign in</h1>
            <p className="text-center text-sm text-gray-600">Use the username and password from your server <code className="text-gray-800">.env</code> file.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 rounded-xl border border-[#0f084b]/30 bg-blue-50 p-6">
            <div className="flex items-center gap-2 text-[#0f084b]">
              <Shield size={18} />
              <span className="text-sm font-medium">Credentials</span>
            </div>
            {loginErr && <p className="text-sm text-red-600">{loginErr}</p>}
            <input
              autoComplete="username"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b] focus:ring-1 focus:ring-[#0f084b]"
            />
            <input
              type="password"
              autoComplete="current-password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b] focus:ring-1 focus:ring-[#0f084b]"
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-[#0f084b] py-3 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <img src="/logo-monarque.png" alt="Monarque Stays" className="h-16 w-auto object-contain sm:h-20" loading="lazy" />
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div>
              <h1 className="font-serif text-2xl text-[#0f084b]">Admin</h1>
              <p className="text-sm text-gray-600">Upload and manage listings</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-medium">
            <Shield size={18} />
            Signed in
          </div>
          <p className="mt-1 text-xs text-emerald-800/90">Session is stored for this browser tab until you sign out or it expires.</p>
        </div>

        {msg && <p className="mb-4 text-sm text-emerald-600">{msg}</p>}
        {err && <p className="mb-4 text-sm text-red-600">{err}</p>}

        <form onSubmit={handleSubmit} className="mb-12 space-y-4 rounded-xl border border-gray-300 bg-gray-50 p-6">
          <h2 className="font-medium text-[#0f084b]">New property</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input required placeholder="Price (USD)" type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input required placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="sm:col-span-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input required placeholder="Bedrooms" type="number" min={0} value={form.bedrooms} onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input required placeholder="Bathrooms" type="number" min={0} value={form.bathrooms} onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input required placeholder="Area (sqft)" type="number" min={0} value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <input placeholder="Rating (0–5)" type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]">
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
              <option value="cabin">Cabin</option>
              <option value="other">Other</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.isForRent} onChange={(e) => setForm((f) => ({ ...f, isForRent: e.target.checked }))} className="rounded" />
              For rent (monthly)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="rounded" />
              Featured
            </label>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f084b]" />
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#0f084b]/40 bg-blue-50 px-4 py-6 hover:bg-blue-100">
            <ImagePlus className="text-[#0f084b]" size={24} />
            <div>
              <p className="text-sm font-medium">Cover image</p>
              <p className="text-xs text-gray-600">{file ? file.name : "PNG, JPG, WebP up to 8MB"}</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-6 hover:bg-gray-200">
            <span className="text-[#0f084b] text-xl font-bold">+</span>
            <div>
              <p className="text-sm font-medium">Additional property images</p>
              <p className="text-xs text-gray-600">{additionalFiles.length > 0 ? `${additionalFiles.length} files selected` : "Optional, choose up to 8 images"}</p>
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setAdditionalFiles(Array.from(e.target.files || []).slice(0, 8))} />
          </label>
          <button type="submit" className="w-full rounded-lg bg-[#0f084b] py-3 text-sm font-semibold text-white hover:bg-opacity-90 sm:w-auto sm:px-8">
            Publish property
          </button>
        </form>

        <h2 className="mb-4 font-medium text-gray-900">All properties</h2>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {list.map((p) => (
              <PropertyItem key={p.id} property={p} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
