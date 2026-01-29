import Link from "next/link";
import { useState } from "react";

interface Props {
  //   propertyId: string;
}

export default function SavedSearchCard({}: // availability,
Props) {
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
                For Rent • Duplex
              </h3>

              {/* <!-- Search criteria badges --> */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  3 Bedrooms
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  2 Kitchens
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  2 Toilets
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  For Rent
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Within 2km of location
                </span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  Bungerlow
                </span>

                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Gym
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Wifi
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Parking space
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Kids Play Area
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Laundry
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: CCTV Surviallance
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  From: Olatobi Agency
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Floor Size: 100 sqFt - 300 sqFT
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Pricing: #100,000 - #800,00
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Is: New Building
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Is: Pet Friendly
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  From: Olatobi Agency
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Has: Architectural Plans
                </span>
              </div>
            </div>

            {/* <!-- Dropdown Icon --> */}
            <svg
              className={`w-15 h-15 mt-1 text-gray-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* <!-- Dropdown Content --> */}
          {isOpen && (
            <div id="search-1" className="border-t bg-gray-50">
              <ul className="divide-y">
                {/* <!-- Property Item --> */}
                <li className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      3 Bedroom Duplex – Lekki
                    </h4>
                    <p className="text-sm text-gray-500">
                      ₦2,500,000 / year • 3 Beds • 2 Kitchens
                    </p>
                  </div>
                  <Link
                    href="#"
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </li>

                <li className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Luxury Duplex – Ajah
                    </h4>
                    <p className="text-sm text-gray-500">
                      ₦3,200,000 / year • 3 Beds • 2 Kitchens
                    </p>
                  </div>
                  <Link
                    href="#"
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </li>

                {/* <!-- Empty State <!-- */}
                <li className="p-4 text-sm text-gray-500 text-center">
                  No matching properties yet
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
