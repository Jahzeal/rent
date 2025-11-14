"use client"

import { X, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

interface Listing {
  id: number
  title: string
  location: string
  price: string
  beds: number
  baths: number
  images: string[]
  description?: string
  amenities?: string[]
}


interface ListingDetailsModalProps {
  listing: Listing 
  isOpen: boolean
  onClose: () => void
  isFavorited: boolean
  onFavoriteToggle: (id: number) => void
}

export default function ListingDetailsModal({
  listing,
  isOpen,
  onClose,
  isFavorited,
  onFavoriteToggle,
}: ListingDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !listing) return null

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto max-w-3xl w-full">
          <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-white">
            <h2 className="text-xl font-semibold text-foreground">{listing.title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={listing.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} className="text-foreground" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} className="text-foreground" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white w-6" : "bg-white/50 w-2"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-semibold">
                {currentImageIndex + 1} / {listing.images.length}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground mb-2">{listing.location}</p>
                  <p className="text-4xl font-bold text-primary">{listing.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFavoriteToggle(listing.id)}
                    className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : "text-foreground"} />
                  </button>
                  <button
                    className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={20} className="text-foreground" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                  <p className="text-2xl font-semibold text-foreground">{listing.beds}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Bathrooms</p>
                  <p className="text-2xl font-semibold text-foreground">{listing.baths}</p>
                </div>
              </div>

              {listing.description && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-foreground text-sm leading-relaxed">{listing.description}</p>
                </div>
              )}

              {listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent">
                Message
              </Button>
              <Button className="flex-1">Contact Agent</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
