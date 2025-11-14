"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapProps {
  center?: { lng: number; lat: number } | null;
  locationName?: string;
  height?: string; // optional dynamic height
  zoom?: number;   // optional zoom
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map({ center, locationName, height = "500px", zoom = 12 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // default neutral start
      zoom: 2,
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl());

    // Observe container for resize to prevent white space
    const observer = new ResizeObserver(() => mapInstance.current?.resize());
    observer.observe(mapContainer.current);

    return () => {
      observer.disconnect();
      mapInstance.current?.remove();
    };
  }, []);

  // Update map center, marker, and popup
  useEffect(() => {
    if (!mapInstance.current || !center) return;

    mapInstance.current.flyTo({ center: [center.lng, center.lat], zoom, essential: true });

    // Marker handling
    if (markerRef.current) {
      markerRef.current.setLngLat([center.lng, center.lat]);

      if (locationName) {
        if (!markerRef.current.getPopup()) {
          markerRef.current.setPopup(new mapboxgl.Popup({ offset: 25 }));
        }
        markerRef.current.getPopup()!.setText(locationName);
      } else {
        markerRef.current.setPopup(null);
      }
    } else {
      markerRef.current = new mapboxgl.Marker({ color: "#007aff" })
        .setLngLat([center.lng, center.lat])
        .addTo(mapInstance.current);

      if (locationName) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(locationName);
        markerRef.current.setPopup(popup);
      }
    }
  }, [center, locationName, zoom]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
