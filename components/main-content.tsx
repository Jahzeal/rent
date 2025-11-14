"use client"

import Map from "./map"
import ListingsPanel from "./listings-panel"

interface MainContentProps {
  location: { lng: number; lat: number } | null
  locationName: string
  filters?: any
}

export default function MainContent({ location, locationName, filters }: MainContentProps) {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-gray-50 overflow-hidden">
      {/* Map Section */}
      <div className="w-full lg:w-1/2 h-64 sm:h-96 md:h-[500px] lg:h-full bg-gray-200 relative z-0">
        <Map center={location} locationName={locationName} />
      </div>

      {/* Listings Section */}
      <div className="w-full lg:w-1/2 h-64 sm:h-96 md:h-[500px] lg:h-full overflow-y-auto bg-white shadow-inner">
        <ListingsPanel searchLocation={locationName} filters={filters} />
      </div>
    </div>
  )
}
