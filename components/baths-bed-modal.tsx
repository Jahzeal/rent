"use client";

import { useState } from "react";
import { X } from 'lucide-react';

interface BedsBathsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selection: string) => void;
}

export default function BedsBathsModal({
  isOpen,
  onClose,
  onApply,
}: BedsBathsModalProps) {
  const [selectedBedrooms, setSelectedBedrooms] = useState("Any");
  const [selectedBathrooms, setSelectedBathrooms] = useState("Any");
  const [useExactMatch, setUseExactMatch] = useState(false);

  const bedrooms = ["Any", "1+", "2+", "3+", "4+", "5+"];
  const bathrooms = ["Any", "1+", "1.5+", "2+", "3+", "4+"];

  const handleApply = () => {
    const selection =
      selectedBedrooms === "Any" && selectedBathrooms === "Any"
        ? "Any"
        : `${selectedBedrooms} bed, ${selectedBathrooms} bath`;
    onApply(selection);
    onClose();
  };

  const handleReset = () => {
    setSelectedBedrooms("Any");
    setSelectedBathrooms("Any");
    setUseExactMatch(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-xl p-0 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Beds & Bathrooms
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Bedrooms Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {bedrooms.map((bedroom) => (
                  <button
                    key={bedroom}
                    onClick={() => setSelectedBedrooms(bedroom)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedBedrooms === bedroom
                        ? "bg-primary text-primary-foreground border-primary border"
                        : "border border-border bg-white text-foreground hover:border-primary hover:bg-muted"
                    }`}
                  >
                    {bedroom}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Bathrooms</h3>
              <div className="flex flex-wrap gap-2">
                {bathrooms.map((bathroom) => (
                  <button
                    key={bathroom}
                    onClick={() => setSelectedBathrooms(bathroom)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedBathrooms === bathroom
                        ? "bg-primary text-primary-foreground border-primary border"
                        : "border border-border bg-white text-foreground hover:border-primary hover:bg-muted"
                    }`}
                  >
                    {bathroom}
                  </button>
                ))}
              </div>
            </div>

            {/* Use exact match checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="exact-match"
                checked={useExactMatch}
                onChange={(e) => setUseExactMatch(e.target.checked)}
                className="w-4 h-4 rounded border border-border cursor-pointer"
              />
              <label
                htmlFor="exact-match"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Use exact match
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 text-primary font-semibold text-sm rounded-lg hover:bg-muted transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
