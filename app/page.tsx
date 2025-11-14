"use client";

import { useState } from "react";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";

interface AppliedFilters {
  price: { min: number; max: number } | null;
  beds: string;
  propertyType: string;
  moreOptions: any;
}

export default function Home() {
  const [location, setLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [filters, setFilters] = useState<AppliedFilters>({
    price: null,
    beds: "Any",
    propertyType: "All types",
    moreOptions: null,
  });

  // Handle search
  const handleSearch = (name: string, coords?: { lng: number; lat: number }) => {
    console.log("[v0] Search triggered with coords:", coords);
    setLocationName(name || "");
    setLocation(coords || null);
  };

  // Handle filter updates
  const handleFiltersChange = (newFilters: AppliedFilters) => {
    setFilters(newFilters);
  };

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
  );
}
