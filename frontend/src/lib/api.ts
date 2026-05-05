import type { Property } from "../types/property"

const API = "/api"

export function buildPropertyQuery(params: Record<string, string | number | boolean | undefined>) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === "" || v === false) return
    sp.set(k, String(v))
  })
  return sp.toString()
}

export async function fetchProperties(
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<Property[]> {
  const q = buildPropertyQuery(params)
  const res = await fetch(`${API}/properties${q ? `?${q}` : ""}`)
  if (!res.ok) throw new Error("Failed to load properties")
  return res.json()
}

export async function adminLogin(username: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || "Login failed")
  }
  return res.json()
}

export async function createProperty(
  form: FormData,
  adminToken: string
): Promise<Property> {
  const res = await fetch(`${API}/properties`, {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || "Create failed")
  }
  return res.json()
}

export async function deleteProperty(id: string, adminToken: string): Promise<void> {
  const res = await fetch(`${API}/properties/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  if (!res.ok) throw new Error("Delete failed")
}
