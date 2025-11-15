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
  onFavoriteToggle
}: ListingDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !listing) return null

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* MODAL CONTAINER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl">

          {/* HEADER */}
          <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white z-20">
            <h2 className="text-lg sm:text-xl font-semibold">{listing.title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
              <X size={24} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 space-y-6">

            {/* IMAGE SLIDER */}
            <div className="relative w-full aspect-[4/3] sm:aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={listing.images[currentImageIndex]}
                className="w-full h-full object-cover"
              />

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full sm:left-4"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full sm:right-4"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {listing.images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full cursor-pointer ${
                          index === currentImageIndex
                            ? "bg-white w-5"
                            : "bg-white/50 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded text-xs sm:text-sm">
                {currentImageIndex + 1} / {listing.images.length}
              </div>
            </div>

            {/* PRICE + ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-sm">{listing.location}</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary mt-1">
                  {listing.price}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onFavoriteToggle(listing.id)}
                  className="p-3 border rounded-lg hover:bg-muted"
                >
                  <Heart
                    size={20}
                    className={isFavorited ? "fill-red-500 text-red-500" : ""}
                  />
                </button>

                <button className="p-3 border rounded-lg hover:bg-muted">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* BEDS/BATHS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="text-2xl font-semibold">{listing.beds}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="text-2xl font-semibold">{listing.baths}</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            {listing.description && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Description</h3>
                <p className="text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* AMENITIES */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1">Message</Button>
              <Button className="flex-1">Contact Agent</Button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
