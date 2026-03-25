"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { timeAgo, sortBy } from "@/lib/utils";
import { formatNumber } from "@/lib/helpers";
import { NAIRA_SIGN } from "@/lib/constants";
import { ApiRequests } from "@/lib/api.request";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Footer from "../Home/Footer";
import Navbar from "../Home/Nav";
import { PropertyList } from "../Properties";

const BedIcon = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
  </svg>
);

const BathIcon = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SizeIcon = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
  </svg>
);

function PropertyCard({ property }: { property: any }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 ${
        hovered ? "border-blue-300 -translate-y-1 shadow-md" : "border-gray-200"
      }`}
    >
      {/* Image area */}
      <div
        className={`relative h-38 ${property.bgClass} flex items-center justify-center`}
        style={{ height: 152 }}
      >
        <span className="text-5xl">{property.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

        {property.isNew ? (
          <span className="absolute top-2.5 left-2.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            New
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 bg-white text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            For rent
          </span>
        )}

        {property.isBoosted && (
          <span className="absolute top-2.5 right-2.5 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
            ⬆ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <div className="text-blue-900 font-serif text-xl tracking-tight leading-tight">
          {property.price}
          <span className="font-sans text-xs font-normal text-gray-400 ml-1">
            /month
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-1 mb-3">{property.address}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <BedIcon /> {property.beds} bed
          </span>
          <span className="flex items-center gap-1">
            <BathIcon /> {property.baths} bath
          </span>
          <span className="flex items-center gap-1">
            <SizeIcon /> {property.sqm} m²
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
        <button className="text-xs text-blue-800 font-medium hover:text-blue-600 transition-colors">
          View property →
        </button>
        {property.hasVirtual ? (
          <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
            Virtual tour
          </span>
        ) : (
          <span className="text-xs text-gray-400">In-person only</span>
        )}
      </div>
    </div>
  );
}

export default function SavedSearches() {
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState<any>({} as any);
  const [sortedBy, setSortedBy] = useState<any>("");
  const [propertyList, setPropertyList] = useState<any[]>([]);

  useEffect(() => {
    const slug = searchParams.get("id");
    if (!slug) return;

    loadData(slug);
  }, []);

  const loadData = async (sId: string) => {
    try {
      const result = await new ApiRequests().findSavedSearchById(sId);
      if (result?.success) {
        setResponseData(result.data);
        const list = (result.data.savedSearchResults as any[]).map(
          (item) => item.property
        );
        setPropertyList(list);
      }
    } catch (error) {
      let message = "An error occurred";
      if (error instanceof AxiosError) {
        message = error.message;
      }
      toast(message, { description: JSON.stringify(error) });
      throw error;
    }
  };

  const sortDataBy = (value: string) => {
    setSortedBy(value);
    const [field, order] = value.split("_");

    if (!field || !order) return;

    setPropertyList((prev) => {
      const sorted = sortBy(prev, order as "asc" | "desc", field);
      console.log({ field, order, length: sorted.length });
      return sorted;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="flex justify-center py-10">
        <div className="w-11/12 px-2">
          {/* Page heading */}
          <div className="mt-12 mb-7">
            <h1 className="font-serif text-4xl text-gray-900 tracking-tight mb-1">
              Saved searches
            </h1>
            <p className="text-sm text-gray-400">
              Staying up to date with your preferred property searches
            </p>
          </div>

          {/* Search card */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 mb-8 relative overflow-hidden">
            {/* Accent top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: "linear-gradient(90deg, #1e3a8a, #3567c4, #f0a500)",
              }}
            />

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="font-medium text-gray-900 text-sm capitalize">
                    {responseData?.searchTerm}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {responseData &&
                    responseData.savedSearchResults?.length > 0 && (
                      <>
                        Last updated{" "}
                        <b>
                          {timeAgo(
                            responseData.savedSearchResults[0].dateCreated
                          )}
                        </b>{" "}
                        ●{" "}
                      </>
                    )}
                  ({responseData?.savedSearchResults?.length ?? 0}) total
                  results
                </p>
              </div>
            </div>

            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
              Active filters
            </p>
            {/* <!-- Search criteria badges --> */}
            <div className="flex flex-wrap gap-2 mt-2">
              {responseData.numberOfBeds && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {responseData.numberOfBeds} Bedrooms
                </span>
              )}
              {responseData.noOfKitchens && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {responseData.noOfKitchens} Kitchens
                </span>
              )}
              {responseData.numberOfToilets && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  {responseData.numberOfToilets} Toilets
                </span>
              )}
              {responseData.upFor && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  For: {responseData.upFor}
                </span>
              )}

              {responseData.xKmOfStartLocation && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Within {responseData.xKmOfStartLocation}km of location
                </span>
              )}

              {responseData.propertyType && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded capitalize">
                  {responseData.propertyType.name}
                </span>
              )}

              {"hasGym" in responseData && responseData.hasGym && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Gym
                </span>
              )}

              {"hasWifi" in responseData && responseData.hasWifi && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Wifi
                </span>
              )}

              {"hasCarParking" in responseData &&
                responseData.hasCarParking && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Parking space
                  </span>
                )}

              {"hasKidsPlayArea" in responseData &&
                responseData.hasKidsPlayArea && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Kids Play Area
                  </span>
                )}

              {"hasLaundry" in responseData && responseData.hasLaundry && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Laundry
                </span>
              )}

              {"hasCctv" in responseData && responseData.hasCctv && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: CCTV Surviallance
                </span>
              )}

              {responseData.agency && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded capitalize">
                  From: {responseData.agency.name}
                </span>
              )}

              {responseData.state && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded capitalize">
                  In: {responseData.state.name}
                </span>
              )}

              {responseData.startPriceRange && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Pricing: {NAIRA_SIGN}
                  {formatNumber(responseData.startPriceRange)}- {NAIRA_SIGN}
                  {formatNumber(responseData.endPriceRange)}
                </span>
              )}

              {responseData.roomSpaceSizeStartRange && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Floor Size: {responseData.roomSpaceSizeStartRange} sqFt -{" "}
                  {responseData.roomSpaceSizeEndRange} sqFT
                </span>
              )}

              {"isNewBuilding" in responseData &&
                responseData.isNewBuilding && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Is: New Building
                  </span>
                )}

              {"isPetFriendly" in responseData &&
                responseData.isPetFriendly && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Is: Pet Friendly
                  </span>
                )}
            </div>
          </div>

          {propertyList && propertyList?.length > 0 ? (
            <>
              {/* Results bar */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-400">
                  <span className="text-gray-800 font-medium">
                    {responseData?.savedSearchResults?.length} properties
                  </span>{" "}
                  match your search
                </p>
                <select
                  value={sortedBy}
                  onChange={(e) => sortDataBy(e.target.value)}
                  className="text-xs text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-full outline-none cursor-pointer"
                >
                  <option value="grandTotalPrice_desc">Highest Price</option>
                  <option value="grandTotalPrice_asc">Lowest Price</option>
                  <option value="dateCreated_desc">Most Recent</option>
                  <option value="dateCreated_asc">Least Recent</option>
                </select>
              </div>

              {/* Grid */}
              <PropertyList array={propertyList} />
            </>
          ) : (
            <div className="text-center text-base">
              <p>
                oops...no results found yet. We'll keep searching and let you
                know
              </p>

              <Link href={"/properties"}>
                <Button className="gap-2 mt-4 cursor-pointer">
                  <Search /> Continue browsing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
