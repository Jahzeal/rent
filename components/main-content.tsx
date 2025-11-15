"use client";

import { useEffect, useState } from "react";
import Map from "./map";
import ListingsPanel from "./listings-panel";

interface MainContentProps {
  location: { lng: number; lat: number } | null;
  locationName: string;
  filters?: any;
}

export default function MainContent({
  location,
  locationName,
  filters,
}: MainContentProps) {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e: MediaQueryListEvent) =>
      setIsLargeScreen(e.matches);

    setIsLargeScreen(mql.matches); // initial value
    mql.addEventListener("change", handleChange);

    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-gray-50 overflow-hidden">
      {/* MAP - hidden on small screens, visible on lg+ */}
      <div className="hidden lg:block lg:w-1/2 h-64 sm:h-96 md:h-[500px] lg:h-full bg-gray-200 relative z-0">
        <Map center={location} locationName={locationName} />
      </div>

      {/* LISTINGS PANEL */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white shadow-inner">
        <ListingsPanel searchLocation={locationName} filters={filters} />
      </div>
    </div>
  );
}
