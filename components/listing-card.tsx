"use client"

import { useState } from "react"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"

interface Listing {
  id: string
  images?: string[]
  image?: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms?: number
  style: string
  offer: string | null
  prices: { beds: number; price: number }[]
  location?: string
  type?: string
  description?: string
  amenities?: string[]
}

interface ListingCardProps {
  listing: Listing
  isFavorited?: boolean
  onFavoriteToggle?: () => void
  onViewDetails?: () => void
}

export default function ListingCard({
  listing,
  isFavorited = false,
  onFavoriteToggle,
  onViewDetails,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = listing.images || (listing.image ? [listing.image] : ["/placeholder.svg"])

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="p-4 sm:p-6 hover:bg-muted/30 transition-colors cursor-pointer">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 group">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white text-foreground text-xs font-semibold rounded">{listing.style}</span>
            {listing.offer && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                {listing.offer}
              </span>
            )}
          </div>

          {/* Heart button */}
          <button
            onClick={onFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition-colors"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={`${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} className="text-foreground" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={18} className="text-foreground" />
              </button>

              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          {/* Title and Address */}
          <h3 className="font-semibold text-foreground text-base mb-1">
            ${listing.price}+ {listing.bedrooms} bd
          </h3>
          <p className="text-foreground font-medium mb-1">{listing.title}</p>
          <p className="text-muted-foreground text-sm mb-4">{listing.address}</p>

          {/* Price breakdown */}
          <div className="flex flex-wrap gap-2">
            {listing.prices.map((priceOption) => (
              <div key={priceOption.beds} className="flex items-center gap-2">
                <div className="px-3 py-2 border border-border rounded text-center">
                  <div className="text-primary font-semibold text-sm">${priceOption.price}+</div>
                  <div className="text-muted-foreground text-xs">{priceOption.beds} bd</div>
                </div>
              </div>
            ))}
          </div>

          {onViewDetails && (
            <button onClick={onViewDetails} className="mt-3 text-primary font-semibold text-sm hover:underline">
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
