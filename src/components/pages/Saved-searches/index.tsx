'use client';
import { useState } from "react";
import Navbar from "../Home/Nav";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { PaginationControlInterface } from "../../../../utils/interfaces";
import { PropertyList } from "../Properties";
import Footer from "../Home/Footer";

const FILTERS = [
  { icon: "📍", label: "Lagos Island" },
  { icon: "💰", label: "₦800k – ₦1.5m/mo" },
  { icon: "🛏", label: "3 bedrooms" },
  { icon: "🍳", label: "Modern kitchen" },
  { icon: "🏠", label: "Apartment" },
  { icon: "🔑", label: "For rent" },
];

const PROPERTIES = [
  {
    id: 1,
    price: "₦1,250,000",
    address: "14 Ozumba Mbadiwe Ave, Lagos Island",
    beds: 3, baths: 2, sqm: 95,
    bgClass: "bg-blue-100", emoji: "🏙️",
    isNew: true, isBoosted: true, hasVirtual: true,
  },
  {
    id: 2,
    price: "₦950,000",
    address: "7 Kofo Abayomi St, Victoria Island",
    beds: 3, baths: 2, sqm: 80,
    bgClass: "bg-green-100", emoji: "🏢",
    isNew: false, isBoosted: false, hasVirtual: false,
  },
  {
    id: 3,
    price: "₦1,450,000",
    address: "22 Awolowo Rd, Ikoyi, Lagos",
    beds: 3, baths: 3, sqm: 112,
    bgClass: "bg-orange-100", emoji: "🏗️",
    isNew: true, isBoosted: false, hasVirtual: true,
  },
  {
    id: 4,
    price: "₦870,000",
    address: "3 Bode Thomas St, Surulere",
    beds: 3, baths: 2, sqm: 88,
    bgClass: "bg-indigo-100", emoji: "🏠",
    isNew: false, isBoosted: true, hasVirtual: false,
  },
  {
    id: 5,
    price: "₦1,100,000",
    address: "11 Glover Rd, Ikoyi, Lagos",
    beds: 3, baths: 2, sqm: 102,
    bgClass: "bg-red-100", emoji: "🌇",
    isNew: true, isBoosted: false, hasVirtual: true,
  },
  {
    id: 6,
    price: "₦820,000",
    address: "5 Karimu Kotun St, VI",
    beds: 3, baths: 2, sqm: 76,
    bgClass: "bg-emerald-100", emoji: "🏘️",
    isNew: false, isBoosted: false, hasVirtual: false,
  },
];

const BedIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
  </svg>
);

const BathIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SizeIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" />
  </svg>
);

function PropertyCard({ property} : {property : any}) {
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
      <div className={`relative h-38 ${property.bgClass} flex items-center justify-center`} style={{ height: 152 }}>
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
          <span className="font-sans text-xs font-normal text-gray-400 ml-1">/month</span>
        </div>
        <p className="text-gray-400 text-xs mt-1 mb-3">{property.address}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><BedIcon /> {property.beds} bed</span>
          <span className="flex items-center gap-1"><BathIcon /> {property.baths} bath</span>
          <span className="flex items-center gap-1"><SizeIcon /> {property.sqm} m²</span>
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
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [pagination, setPagination] = useState<PaginationControlInterface>(
        {} as PaginationControlInterface
    );

    const loadData = (page : number) => {

    }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar/>
      <div className="flex justify-center py-10">
        <div className="w-11/12 px-2">

            {/* Page heading */}
            <div className="mt-12 mb-7">
            <h1 className="font-serif text-4xl text-gray-900 tracking-tight mb-1">Saved searches</h1>
            <p className="text-sm text-gray-400">Staying up to date with your preferred property searches</p>
            </div>

            {/* Search card */}
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 mb-8 relative overflow-hidden">
            {/* Accent top bar */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, #1e3a8a, #3567c4, #f0a500)" }}
            />

            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-medium text-gray-900 text-sm">Lagos Island — 3-bed apartments</span>
                        {!alertDismissed && (
                        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                            4 new matches
                            <button
                            onClick={() => setAlertDismissed(true)}
                            className="ml-0.5 text-amber-400 hover:text-amber-600 leading-none"
                            >
                            ×
                            </button>
                        </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">Last updated 2 hours ago · 18 total results</p>
                </div>

                <div className="flex gap-2">
                    <button className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full hover:border-blue-800 hover:text-blue-800 transition-all">
                        Edit
                    </button>
                    <button className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full hover:border-red-400 hover:text-red-500 transition-all">
                        Delete
                    </button>
                </div>
            </div>

            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Active filters</p>
            <div className="flex flex-wrap gap-2">
                {FILTERS.map((f, i) => (
                <div
                    key={i}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-full">
                    <span>{f.icon}</span>
                    {f.label}
                </div>
                ))}
            </div>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
                <span className="text-gray-800 font-medium">18 properties</span> match your search
            </p>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-full outline-none cursor-pointer"
            >
                <option value="newest">Sort: Newest first</option>
                <option value="low">Price: Low to high</option>
                <option value="high">Price: High to low</option>
                <option value="relevant">Most relevant</option>
            </select>
            </div>

            {/* Grid */}
            <PropertyList array={PROPERTIES} />

            {/* Pagination */}
            {pagination?.currentPage && (
                <DynamicPagination
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                hasNext={pagination?.hasNext}
                hasPrevious={pagination?.hasPrevious}
                onPageChange={loadData}
                />
            )}
            
        </div>
      </div>
      <Footer/>
    </div>
  );
}
