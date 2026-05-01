export interface Property {
  id: string
  title: string
  price: number
  location: string
  imageUrl: string
  images?: string[]
  bedrooms: number
  bathrooms: number
  area: number
  isForRent?: boolean
  category?: string
  featured?: boolean
  rating?: number
  description?: string
}
