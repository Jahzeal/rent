"use client";
import { useState, useMemo } from "react";
import ListingCard from "./listing-card";
import ListingDetailsModal from "./listing-details-modal";

interface MoreOptionsFilters {
  moveInDate?: string;
  selectedPets?: string[];
  shortTermLease?: boolean;
  commuteTime?: string;
  keywords?: string;
}

interface AppliedFilters {
  price: { min: number; max: number } | null;
  beds: string;
  propertyType: string;
  moreOptions: MoreOptionsFilters | null;
}

interface ListingsPanelProps {
  searchLocation?: string;
  filters?: AppliedFilters;
}

interface Listing {
  id: string;
  images: string[];
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  style: string;
  offer: string | null;
  prices: { beds: number; price: number }[];
  location: string;
  type: string;
  description?: string;
  amenities?: string[];
}

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    images: [
      "/modern-apartment-living-room.png",
      "/modern-apartment-kitchen.png",
      "/cozy-apartment-bedroom.png",
    ],
    title: "NOVO New Hampstead",
    address: "480 John Carter Rd, Chapel Hill",
    price: 1575,
    bedrooms: 1,
    bathrooms: 1,
    style: "Wood-style flooring",
    offer: "12 available units",
    location: "Chapel Hill",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1575 },
      { beds: 2, price: 1950 },
      { beds: 3, price: 2350 },
    ],
    description:
      "Modern apartment with wood-style flooring and premium amenities.",
    amenities: ["WiFi", "Gym", "Parking", "Pool", "Laundry"],
  },
  {
    id: "2",
    images: [
      "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
      "/cozy-living-room.png",
      "/cozy-backyard.png",
    ],
    title: "RENDER Turner Lake",
    address: "by Crescent Communities, Raleigh",
    price: 1584,
    bedrooms: 1,
    bathrooms: 1,
    style: "Sleek urban design",
    offer: "Special Offer",
    location: "Raleigh",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1584 },
      { beds: 2, price: 1925 },
      { beds: 3, price: 2309 },
    ],
    description:
      "Sleek urban design with modern amenities in a prime location.",
    amenities: ["WiFi", "Gym", "Concierge", "Security", "Smart Home"],
  },
  {
    id: "3",
    images: [
      "/modern-apartment-with-kitchen-and-dining-area.jpg",
      "/studio-kitchen.jpg",
      "/studio-bathroom.jpg",
    ],
    title: "Downtown Modern",
    address: "123 Main St, Durham",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    style: "Modern amenities",
    offer: "Special Offer",
    location: "Durham",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1650 },
      { beds: 2, price: 2000 },
      { beds: 3, price: 2400 },
    ],
    description: "Modern apartment with state-of-the-art amenities.",
    amenities: ["Utilities Included", "Furnished", "Pet Friendly", "WiFi"],
  },
  {
    id: "4",
    images: [
      "/modern-apartment-living-room-with-wood-flooring.jpg",
      "/cozy-studio-apartment.png",
      "/spacious-house-exterior.jpg",
    ],
    title: "Chapel Hill Residences",
    address: "95 University Dr, Chapel Hill",
    price: 1495,
    bedrooms: 1,
    bathrooms: 1,
    style: "Student-friendly",
    offer: null,
    location: "Chapel Hill",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1495 },
      { beds: 2, price: 1795 },
      { beds: 3, price: 2195 },
    ],
    description: "Student-friendly accommodation near campus.",
    amenities: ["WiFi", "Parking", "Laundry", "Community Space"],
  },
  {
    id: "5",
    images: [
      "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
      "/cozy-living-room.png",
      "/cozy-backyard.png",
    ],
    title: "Raleigh Downtown Lofts",
    address: "234 Fayetteville St, Raleigh",
    price: 1725,
    bedrooms: 1,
    bathrooms: 1,
    style: "Industrial chic",
    offer: "Special Offer",
    location: "Raleigh",
    type: "Condo",
    prices: [
      { beds: 1, price: 1725 },
      { beds: 2, price: 2150 },
      { beds: 3, price: 2600 },
    ],
    description:
      "Industrial chic lofts in downtown Raleigh with exposed brick.",
    amenities: ["Rooftop Deck", "Gym", "Bike Storage", "Pet Friendly"],
  },
  {
    id: "6",
    images: [
      "/spacious-house-exterior.jpg",
      "/cozy-living-room.png",
      "/cozy-backyard.png",
    ],
    title: "Sunny Valley House",
    address: "456 Oak Lane, Chapel Hill",
    price: 2100,
    bedrooms: 3,
    bathrooms: 2,
    style: "Traditional home",
    offer: "New listing",
    location: "Chapel Hill",
    type: "House",
    prices: [
      { beds: 2, price: 1950 },
      { beds: 3, price: 2100 },
      { beds: 4, price: 2500 },
    ],
    description: "Beautiful traditional house with large backyard.",
    amenities: ["Garage", "Yard", "Porch", "Storage"],
  },
  {
    id: "7",
    images: [
      "/modern-apartment-kitchen.png",
      "/cozy-studio-apartment.png",
      "/modern-apartment-living-room.png",
    ],
    title: "Riverside Condo Complex",
    address: "789 River Rd, Durham",
    price: 1850,
    bedrooms: 2,
    bathrooms: 2,
    style: "Contemporary design",
    offer: null,
    location: "Durham",
    type: "Condo",
    prices: [
      { beds: 1, price: 1650 },
      { beds: 2, price: 1850 },
      { beds: 3, price: 2200 },
    ],
    description: "Contemporary condo with river views and modern finishes.",
    amenities: ["River View", "Fitness Center", "Parking", "Security"],
  },
  {
    id: "8",
    images: [
      "/cozy-apartment-bedroom.png",
      "/modern-apartment-kitchen.png",
      "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
    ],
    title: "Hillside Apartments",
    address: "321 Hill St, Raleigh",
    price: 1425,
    bedrooms: 1,
    bathrooms: 1,
    style: "Cozy spaces",
    offer: null,
    location: "Raleigh",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1425 },
      { beds: 2, price: 1750 },
      { beds: 3, price: 2100 },
    ],
    description: "Cozy apartments in a quiet hillside neighborhood.",
    amenities: ["WiFi", "Laundry", "Parking", "Garden"],
  },
  {
    id: "9",
    images: [
      "/spacious-house-exterior.jpg",
      "/cozy-backyard.png",
      "/cozy-living-room.png",
    ],
    title: "Green Meadows Estate",
    address: "555 Forest Ave, Chapel Hill",
    price: 2450,
    bedrooms: 4,
    bathrooms: 3,
    style: "Luxury estate",
    offer: "Premium property",
    location: "Chapel Hill",
    type: "House",
    prices: [
      { beds: 3, price: 2250 },
      { beds: 4, price: 2450 },
      { beds: 5, price: 2850 },
    ],
    description:
      "Luxurious house with extensive grounds and high-end finishes.",
    amenities: ["Pool", "Garage", "Garden", "Patio", "Security System"],
  },
  {
    id: "10",
    images: [
      "/modern-apartment-living-room.png",
      "/studio-kitchen.jpg",
      "/cozy-apartment-bedroom.png",
    ],
    title: "Park View Condominiums",
    address: "678 Park Blvd, Durham",
    price: 1920,
    bedrooms: 2,
    bathrooms: 2,
    style: "Park-facing view",
    offer: "Special Offer",
    location: "Durham",
    type: "Condo",
    prices: [
      { beds: 1, price: 1750 },
      { beds: 2, price: 1920 },
      { beds: 3, price: 2300 },
    ],
    description: "Park-facing condos with modern amenities and great views.",
    amenities: ["Park View", "Concierge", "Gym", "Pool"],
  },
  {
    id: "11",
    images: [
      "/cozy-studio-apartment.png",
      "/modern-apartment-kitchen.png",
      "/cozy-apartment-bedroom.png",
    ],
    title: "Urban Core Apartments",
    address: "999 Central Ave, Raleigh",
    price: 1550,
    bedrooms: 1,
    bathrooms: 1,
    style: "Downtown living",
    offer: "Move-in Special",
    location: "Raleigh",
    type: "Apartment",
    prices: [
      { beds: 1, price: 1550 },
      { beds: 2, price: 1900 },
      { beds: 3, price: 2300 },
    ],
    description: "Downtown apartments in the heart of the city.",
    amenities: ["WiFi", "Rooftop Lounge", "Security", "Concierge"],
  },
  {
    id: "12",
    images: [
      "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
      "/spacious-house-exterior.jpg",
      "/cozy-backyard.png",
    ],
    title: "Countryside Manor",
    address: "111 Country Lane, Chapel Hill",
    price: 2200,
    bedrooms: 3,
    bathrooms: 2.5,
    style: "Rural charm",
    offer: null,
    location: "Chapel Hill",
    type: "House",
    prices: [
      { beds: 2, price: 2000 },
      { beds: 3, price: 2200 },
      { beds: 4, price: 2600 },
    ],
    description: "Charming countryside house with character and space.",
    amenities: ["Acreage", "Barn", "Well", "Pond"],
  },
];

export default function ListingsPanel({
  searchLocation = "",
  filters,
}: ListingsPanelProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price-low" | "price-high" | "newest"
  >("recommended");

  const filteredListings = useMemo(() => {
    let results = [...SAMPLE_LISTINGS];

    if (searchLocation) {
      const searchTerm = searchLocation.toLowerCase().trim();
      const searchCity = searchTerm.split(",")[0].trim();

      results = results.filter(
        (listing) =>
          listing.location.toLowerCase().includes(searchCity) ||
          listing.location.toLowerCase().includes(searchTerm) ||
          listing.address.toLowerCase().includes(searchCity) ||
          listing.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price
    if (filters?.price) {
      const { min, max } = filters.price;
      results = results.filter(
        (listing) => listing.price >= min && listing.price <= max
      );
    }

    // Filter by beds
    if (filters?.beds && filters.beds !== "Any") {
      results = results.filter((listing) => {
        if (filters.beds === "1 bed") return listing.bedrooms === 1;
        if (filters.beds === "2 beds") return listing.bedrooms === 2;
        if (filters.beds === "3+ beds") return listing.bedrooms >= 3;
        return true;
      });
    }

    // Filter by property type
    if (filters?.propertyType && filters.propertyType !== "All types") {
      results = results.filter(
        (listing) =>
          listing.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));
        break;
      default:
        break;
    }

    return results;
  }, [searchLocation, filters, sortBy]);

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDetailsOpen(true);
  };

  const listingCount = filteredListings.length;

  return (
    <div className="bg-white">
      {/* Header - Keep original design */}
      <div className="sticky top-0 bg-white border-b border-border p-4 sm:p-6 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Rental Listings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {searchLocation
                ? `${listingCount} rental${
                    listingCount !== 1 ? "s" : ""
                  } found in ${searchLocation}`
                : `${listingCount} rentals available`}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "recommended"
                  | "price-low"
                  | "price-high"
                  | "newest"
              )
            }
            className="text-primary font-semibold text-sm hover:underline whitespace-nowrap cursor-pointer px-2 py-1 bg-white border border-primary rounded"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-low">Sort: Price (Low to High)</option>
            <option value="price-high">Sort: Price (High to Low)</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Listings - Keep original design */}
      <div className="divide-y divide-border">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={favorites.includes(listing.id)}
              onFavoriteToggle={() => handleFavoriteToggle(listing.id)}
              onViewDetails={() => handleViewDetails(listing)}
            />
          ))
        ) : (
          <div className="p-4 sm:p-6 text-center text-muted-foreground">
            <p className="text-sm">No listings found for "{searchLocation}"</p>
            <p className="text-xs mt-2">Try adjusting your filters or search</p>
          </div>
        )}
      </div>
      {selectedListing && (
        <ListingDetailsModal
          listing={{
            id: Number(selectedListing.id), // or keep string if you change modal
            title: selectedListing.title,
            location: selectedListing.location,
            price: `$${selectedListing.price}`,
            beds: selectedListing.bedrooms,
            baths: selectedListing.bathrooms,
            images: selectedListing.images,
            description: selectedListing.description,
            amenities: selectedListing.amenities,
          }}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={favorites.includes(selectedListing.id)}
          onFavoriteToggle={() => handleFavoriteToggle(selectedListing.id)}
        />
      )}
    </div>
  );
}
