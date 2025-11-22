"use client"

import { useState, useEffect } from "react" 
import { useSearchParams } from "next/navigation"
import Header from "../../components/header"
import SearchBar from "@/components/search-bar"
import MainContent from "@/components/main-content"

interface AppliedFilters {
  price: { min: number; max: number } | null
  beds: string
  propertyType: string
  moreOptions: any
}

// Helper function to parse URL params into filter state
const parseUrlParams = (params: URLSearchParams): { name: string, coords: { lng: number; lat: number } | null, filters: AppliedFilters } => {
  const name = params.get("location") || ""
  const lat = params.get("lat")
  const lng = params.get("lng")
  const priceMin = params.get("priceMin")
  const priceMax = params.get("priceMax")
  const beds = params.get("beds") || "Any"
  const propertyType = params.get("propertyType") || "All types"

  const coords = (lat && lng) ? { lng: parseFloat(lng), lat: parseFloat(lat) } : null
  
  const price = (priceMin && priceMax) ? 
    { min: parseFloat(priceMin), max: parseFloat(priceMax) } : 
    null

  const filters: AppliedFilters = {
    price,
    beds,
    propertyType,
    moreOptions: null, // You'd need a more complex parser for moreOptions
  }

  return { name, coords, filters }
}

export default function Rentals() {
  const searchParams = useSearchParams() // <-- Initialize hook
  
  // Initialize state based on the current URL search parameters
  const initialData = parseUrlParams(searchParams)

  const [location, setLocation] = useState(initialData.coords)
  const [locationName, setLocationName] = useState(initialData.name)
  const [filters, setFilters] = useState<AppliedFilters>(initialData.filters)

  useEffect(() => {
 
    console.log(" Current Location/Filters state:", { locationName, location, filters })
  }, [locationName, location, filters])


  const handleSearch = (name: string, coords?: { lng: number; lat: number }) => {
    console.log(" Search triggered with coords:", coords)
    setLocationName(name || "")
    setLocation(coords || null)
  }

  const handleFiltersChange = (newFilters: AppliedFilters) => {
    setFilters(newFilters)
  }

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />

      {/* Search Bar and Filters */}
      <SearchBar onSearch={handleSearch} onFiltersChange={handleFiltersChange} />

      {/* Map + Listings */}
      <div className="h-full overflow-hidden">
        <MainContent
          location={location}
          locationName={locationName}
          filters={filters}
        />
      </div>
    </main>
  )
}