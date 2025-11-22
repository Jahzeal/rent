"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";
import { SAMPLE_LISTINGS } from "@/lib/sample-listing";

interface SearchHistory {
  id: string;
  location: string;
  coords?: { lng: number; lat: number };
  timestamp: number;
}

interface Property {
  id: string;
  image: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  address: string;
  badge?: string;
  location: string;
  type: string;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [mounted, setMounted] = useState(false);
  const [continueSearchProperties, setContinueSearchProperties] = useState<
    Property[]
  >([]);
  const [isSearching, setIsSearching] = useState(false); // Declare setIsSearching variable

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchHistory.length > 0) {
      const lastSearch = searchHistory[0];
      fetchPropertiesForLocation(lastSearch);
    } else {
      const allProperties = SAMPLE_LISTINGS.slice(0, 6).map((listing) => ({
        id: listing.id,
        image: listing.images[0],
        price: listing.price,
        beds: listing.bedrooms,
        baths: listing.bathrooms,
        sqft: 800 + Number.parseInt(listing.id) * 100, // Generate sqft based on listing
        status: "Active",
        address: listing.address,
        badge: listing.offer || undefined,
        location: listing.location,
        type: listing.type,
      }));
      setContinueSearchProperties(allProperties);
    }
  }, [searchHistory]);

  const fetchPropertiesForLocation = async (search: SearchHistory) => {
    const searchTerm = search.location.toLowerCase().trim();
    const searchCity = searchTerm.split(",")[0].trim();

    // Filter listings by location
    let filteredListings = SAMPLE_LISTINGS.filter(
      (listing) =>
        listing.location.toLowerCase().includes(searchCity) ||
        listing.location.toLowerCase().includes(searchTerm) ||
        listing.address.toLowerCase().includes(searchCity) ||
        listing.address.toLowerCase().includes(searchTerm)
    );

    // If no matches found, show nearby properties (all available)
    if (filteredListings.length === 0) {
      console.log(
        "[v0] No exact matches found, showing all available properties"
      );
      filteredListings = SAMPLE_LISTINGS;
    }

    // Convert to Property format and take first 6
    const properties: Property[] = filteredListings
      .slice(0, 6)
      .map((listing) => ({
        id: listing.id,
        image: listing.images[0],
        price: listing.price,
        beds: listing.bedrooms,
        baths: listing.bathrooms,
        sqft: 675 + Number.parseInt(listing.id) * 100,
        status: "Active",
        address: listing.address,
        badge: listing.offer || undefined,
        location: listing.location,
        type: listing.type,
      }));

    console.log(
      "[v0] Found",
      properties.length,
      "properties for",
      search.location
    );
    setContinueSearchProperties(properties);
  };

  const geocodeLocation = async (location: string) => {
    if (!location.trim()) return null;

    try {
      setIsSearching(true);
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${token}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        const placeName = data.features[0].place_name;
        return { location: placeName, coords: { lng, lat } };
      }
      return { location, coords: undefined };
    } catch (error) {
      return { location, coords: undefined };
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const result = await geocodeLocation(searchInput);
    if (result) {
      const newEntry: SearchHistory = {
        id: Date.now().toString(),
        location: result.location,
        coords: result.coords,
        timestamp: Date.now(),
      };

      const updated = [newEntry, ...searchHistory.slice(0, 4)];
      setSearchHistory(updated);
      localStorage.setItem("searchHistory", JSON.stringify(updated));

      const params = new URLSearchParams();
      params.set("location", result.location);
      if (result.coords) {
        params.set("lat", result.coords.lat.toString());
        params.set("lng", result.coords.lng.toString());
      }

      window.location.href = `/rentals?${params.toString()}`;
    }
  };

  const handleContinueSearch = (search: SearchHistory) => {
    const params = new URLSearchParams();
    params.set("location", search.location);
    if (search.coords) {
      params.set("lat", search.coords.lat.toString());
      params.set("lng", search.coords.lng.toString());
    }
    window.location.href = `/rentals?${params.toString()}`;
  };

  const scrollCarousel = (direction: "left" | "right") => {
    const carousel = document.getElementById("property-carousel");
    if (carousel) {
      const scrollAmount = 320;
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-white">
        <Header />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-blue-50 to-blue-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat "
          style={{ backgroundImage: "url(/buying.jpg)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-white sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance leading-tight">
              Rentals. Agents. Loans. Homes.
            </h1>

            <form
              onSubmit={handleSearch}
              className={`relative mb-8 transition-opacity duration-300 ${
                isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="Enter an address, neighborhood, city, or ZIP code"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setShowSearchDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSearchDropdown(false), 200)
                    }
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
                  >
                    <Search size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-40 overflow-hidden max-w-full">
                  <div className="flex items-center gap-3 p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer">
                    <MapPin size={18} className="text-gray-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground truncate">
                      Current Location
                    </span>
                  </div>

                  {searchHistory.length > 0 && (
                    <>
                      <div className="px-3 sm:px-4 pt-3 pb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Search History
                        </p>
                      </div>
                      {searchHistory.slice(0, 2).map((search) => (
                        <div
                          key={search.id}
                          onClick={() => handleContinueSearch(search)}
                          className="flex items-center gap-3 p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer"
                        >
                          <Clock
                            size={16}
                            className="text-gray-600 flex-shrink-0"
                          />
                          <span className="text-sm sm:text-base text-foreground truncate">
                            {search.location}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Get Recommendations Section */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Get home recommendations
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              Sign in for a more personalized experience.
            </p>
            <Link
              href="/signin"
              className="px-5 sm:px-6 py-2 sm:py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base inline-block"
            >
              Sign in
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div
              className="h-48 sm:h-56 md:h-64 rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: "url(/houses.jpg)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {continueSearchProperties.length > 0 && (
        <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1 text-balance">
                  {searchHistory.length > 0
                    ? `Continue searching for: ${searchHistory[0].location}, For Rent, Houses, Townhomes, Apartments, Condos`
                    : "Available Rentals: Houses, Townhomes, Apartments, Condos"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {continueSearchProperties.length}+ new listings
                </p>
              </div>
              <div className="hidden sm:flex gap-2 flex-shrink-0">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Property Carousel */}
            <div
              id="property-carousel"
              className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {continueSearchProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex-shrink-0 w-64 sm:w-72 md:w-80 cursor-pointer group"
                  onClick={() => {
                    if (searchHistory.length > 0) {
                      handleContinueSearch(searchHistory[0]);
                    } else {
                      // Navigate to rentals with property location
                      const params = new URLSearchParams();
                      params.set("location", property.location);
                      window.location.href = `/rentals?${params.toString()}`;
                    }
                  }}
                >
                  {/* Property Image */}
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.address}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {property.badge && (
                      <div
                        className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 rounded-md text-xs font-semibold text-white ${
                          property.badge.toLowerCase().includes("apply") ||
                          property.badge.toLowerCase().includes("special")
                            ? "bg-red-600"
                            : "bg-gray-800"
                        }`}
                      >
                        {property.badge}
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-foreground">
                        ${property.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-1 flex-wrap">
                      <span className="font-semibold">{property.beds} bd</span>
                      <span>|</span>
                      <span className="font-semibold">{property.baths} ba</span>
                      <span>|</span>
                      <span className="font-semibold">
                        {property.sqft.toLocaleString()} sqft
                      </span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">
                        {property.status}
                      </span>
                    </div>
                    {property.address && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        {property.address}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {property.type} • {property.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Buy a home",
                desc: "A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.",
                btn: "Find a local agent",
                icon: "👥",
              },
              {
                title: "Rent a home",
                desc: "We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.",
                btn: "Find rentals",
                icon: "🏘️",
              },
              {
                title: "Sell a home",
                desc: "No matter what path you take to sell your home, we can help you navigate a successful sale.",
                btn: "See your options",
                icon: "🔑",
              },
            ].map((action, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200 hover:shadow-xl transition-shadow text-center"
              >
                {/* Icon Box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl">{action.icon}</span>
                </div>

                {/* Heading */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  {action.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {action.desc}
                </p>

                {/* Button */}
                <button className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base">
                  {action.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BuyAbility Section */}
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            Find homes you can afford with BuyAbility
            <sup className="text-sm">TM</sup>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
            Answer a few questions. We'll highlight homes you're likely to
            qualify for.
          </p>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calculator Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                {/* Zillow Home Loans Logo */}
                <div className="mb-4 sm:mb-6">
                  <svg className="h-5 sm:h-6" viewBox="0 0 160 24" fill="none">
                    <path
                      d="M8 4L0 12h3v8h10v-8h3L8 4zm0 2.83L13.17 12H12v6H4v-6H2.83L8 6.83z"
                      fill="#0074E4"
                    />
                    <text
                      x="20"
                      y="16"
                      className="fill-current text-gray-900 font-bold text-sm"
                    >
                      Zillow Home Loans
                    </text>
                  </svg>
                </div>

                {/* Calculator Fields */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      $ - -
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Suggested target price
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      $ - -
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      BuyAbility<sup className="text-xs">TM</sup>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="border-b border-gray-200 pb-2">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">
                        $ - -
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Mo. payment
                      </div>
                    </div>
                    <div className="border-b border-gray-200 pb-2">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">
                        -- %
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Today's rate
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-2">
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      -- %
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">APR</div>
                  </div>
                </div>

                <Link
                  href="/signin"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Let's get started
                </Link>
              </div>
            </div>

            {/* Property Carousel */}
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {[
                  "/luxury-penthouse.png",
                  "/penthouse-terrace.png",
                  "/cozy-living-room.png",
                ].map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[32%] snap-start"
                  >
                    <div className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative h-48 sm:h-56">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`BuyAbility home ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded">
                          Within BuyAbility
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Zillow's Recommendations Section */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Heading and Description */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              About Zillow's Recommendations
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Recommendations are based on your location and search activity,
              such as the homes you've viewed and saved and the filters you've
              used. We use this information to bring similar homes to your
              attention, so you don't miss out.
            </p>
          </div>

          {/* Dropdown Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {[
              { label: "Real Estate" },
              { label: "Rentals" },
              { label: "Mortgage Rates" },
              { label: "Browse Homes" },
            ].map((item, idx) => (
              <button
                key={idx}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-white hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm sm:text-base font-medium text-foreground">
                  {item.label}
                </span>

                {/* Dropdown Arrow Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-400 pt-6 space-y-4 text-center">
            {/* First Row */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
              <a href="#" className="text-black hover:underline">
                About
              </a>
              <a href="#" className="text-black hover:underline">
                Zestimates
              </a>
              <a href="#" className="text-black hover:underline">
                Research
              </a>
              <a href="#" className="text-black hover:underline">
                Careers
              </a>
              <a href="#" className="text-black hover:underline">
                Applicant Privacy Notice
              </a>
              <a href="#" className="text-black hover:underline">
                Help
              </a>
              <a href="#" className="text-black hover:underline">
                Advertise
              </a>
              <a href="#" className="text-black hover:underline">
                Fair Housing Guide
              </a>
              <a href="#" className="text-black hover:underline">
                Advocacy
              </a>
              <a href="#" className="text-black hover:underline">
                Terms of use
              </a>
              <a href="#" className="text-black hover:underline">
                Privacy Notice
              </a>
              <a href="#" className="text-black hover:underline">
                Ad Choices
              </a>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
              <a href="#" className="text-black hover:underline">
                Cookie Preference
              </a>
              <a href="#" className="text-black hover:underline">
                Learn
              </a>
              <a href="#" className="text-black hover:underline">
                AI
              </a>
              <a href="#" className="text-black hover:underline">
                Mobile Apps
              </a>
            </div>

            {/* Third Row */}
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
              <a href="#" className="text-black hover:underline">
                Trulia
              </a>
              <a href="#" className="text-black hover:underline">
                StreetEasy
              </a>
              <a href="#" className="text-black hover:underline">
                HotPads
              </a>
              <a href="#" className="text-black hover:underline">
                Out East
              </a>
            </div>

            {/* Privacy */}
            <div className="flex justify-center">
              <a
                href="#"
                className="text-blue-600 hover:underline text-xs sm:text-sm"
              >
                Do Not Sell or Share My Personal Information →
              </a>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="border-t border-gray-400 pt-6 space-y-4 text-center">
            <p className="text-xs text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Zillow Group is committed to ensuring digital accessibility for
              individuals with disabilities. We are continuously working to
              improve the accessibility of our web experience for everyone, and
              we welcome feedback and accommodation requests. If you wish to
              report an issue or seek an accommodation, please{" "}
              <a href="#" className="text-black-600 hover:underline">
                let us know
              </a>
              .
            </p>

            <p className="text-xs text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Zillow, Inc. holds real estate brokerage{" "}
              <a href="#" className="text-blue-600 hover:underline">
                licenses
              </a>{" "}
              in multiple states. Zillow (Canada), Inc. holds real estate
              brokerage{" "}
              <a href="#" className="text-blue-600 hover:underline">
                licenses
              </a>{" "}
              in multiple provinces.
            </p>

            <p className="text-xs text-gray-600">
              This site is not authorized by the New York State Department of
              Financial Services. No mortgage solicitation activity or loan
              applications for properties located in the State of New York can
              be facilitated through this site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
