import Link from "next/link";
import { useEffect, useState } from "react";
import { NAIRA_SIGN } from "@/lib/constants";
import { formatNumber } from "@/lib/helpers";

interface Props {
  search: any;
}

export default function SavedSearchCard({ search }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="max-w-3xl py-4 mx-auto space-y-4">
        {/* <!-- Saved Search Widget --> */}
        <div className="border rounded-xl shadow-sm bg-white">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-start justify-between p-4 hover:bg-gray-50 text-left"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {/* For Rent • Duplex */}
                {new Date(search.dateCreated).toLocaleString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              {/* <!-- Search criteria badges --> */}
              <div className="flex flex-wrap gap-2 mt-2">
                {search.noOfBedrooms && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {search.noOfBedrooms} Bedrooms
                  </span>
                )}
                {search.noOfKitchens && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {search.noOfKitchens} Kitchens
                  </span>
                )}
                {search.noOfToilets && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    2 Toilets
                  </span>
                )}

                {search.upFor && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    For: {search.upFor}
                  </span>
                )}

                {search.xKmOfStartLocation && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Within {search.xKmOfStartLocation}km of location
                  </span>
                )}

                {search.propertyType && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {search.propertyType.name}
                  </span>
                )}

                {"hasGym" in search && search.hasGym && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Gym
                  </span>
                )}

                {"hasWifi" in search && search.hasWifi && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Wifi
                  </span>
                )}

                {"hasCarParking" in search && search.hasCarParking && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Parking space
                  </span>
                )}

                {"hasKidsPlayArea" in search && search.hasKidsPlayArea && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Kids Play Area
                  </span>
                )}

                {"hasLaundry" in search && search.hasLaundry && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: Laundry
                  </span>
                )}

                {"hasCctv" in search && search.hasCctv && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Has: CCTV Surviallance
                  </span>
                )}

                {search.agency && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    From: {search.agency.name}
                  </span>
                )}

                {search.startPriceRange && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Pricing: {NAIRA_SIGN}
                    {formatNumber(search.startPriceRange)}- {NAIRA_SIGN}
                    {formatNumber(search.endPriceRange)}
                  </span>
                )}

                {search.roomSpaceSizeStartRange && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Floor Size: {search.roomSpaceSizeStartRange} sqFt -{" "}
                    {search.roomSpaceSizeEndRange} sqFT
                  </span>
                )}

                {"isNewBuilding" in search && search.isNewBuilding && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Is: New Building
                  </span>
                )}

                {"isPetFriendly" in search && search.isPetFriendly && (
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    Is: Pet Friendly
                  </span>
                )}
              </div>
            </div>

            {/* <!-- Dropdown Icon --> */}
            <svg
              className={`cursor-pointer w-15 h-15 mt-1 text-gray-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* <!-- Dropdown Content --> */}
          {isOpen && (
            <div className="border-t bg-gray-50">
              <ul className="divide-y">
                {(search.savedSearchResults as any[]).length > 0 ? (
                  search.savedSearchResults.map(({ property }: any) => (
                    <li
                      key={property.id}
                      className="p-4 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {property.title} – {property.state.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {property.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {NAIRA_SIGN}
                          {formatNumber(property.grandTotalPrice)} / year
                        </p>
                      </div>
                      <Link
                        href={`/properties/view?id=${property.slug}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-sm text-gray-500 text-center">
                    No matching properties yet
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
