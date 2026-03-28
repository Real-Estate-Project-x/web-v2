"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ApiRequests } from "@/lib/api.request";
import { PaginationControlInterface } from "../../../../utils/interfaces";

// ── Types ─────────────────────────────────────────────────────────────────────
type ViewingType = "virtual" | "in_person";
type TabKey = "upcoming" | "today" | "past";

interface Agency {
  name: string;
  logo: string;
  url: string;
}

interface BaseViewing {
  id: number;
  address: string;
  date: string;
  time: string;
  type: ViewingType;
  agency: Agency;
  propertyUrl: string;
}

interface ActiveViewing extends BaseViewing {
  meetLink?: string;
}

interface PastViewing extends BaseViewing {
  rated: boolean;
  rating?: number;
  comment?: string;
}

interface StarRatingProps {
  value: number;
  onChange: (n: number) => void;
}

interface RatingModalProps {
  viewing: PastViewing;
  onClose: () => void;
  onSubmit: (id: number, stars: number, comment: string) => void;
}

interface ActiveCardProps {
  v: ActiveViewing;
}

interface PastCardProps {
  v: PastViewing;
  onRate: (v: PastViewing) => void;
}

interface PaginationProps {
  total: number;
  page: number;
  onPage: (n: number) => void;
}

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const UPCOMING: ActiveViewing[] = [
  {
    id: 1,
    address: "123 Main Street",
    date: "2026-04-15",
    time: "14:00",
    type: "virtual",
    meetLink: "https://meet.google.com/abc-defg-hij",
    agency: {
      name: "Skyline Realty",
      logo: "https://i.pravatar.cc/40?img=11",
      url: "https://example.com/skyline",
    },
    propertyUrl: "/properties/123-main-street",
  },
  {
    id: 2,
    address: "456 Oak Avenue",
    date: "2026-04-18",
    time: "10:30",
    type: "in_person",
    agency: {
      name: "Greenfield Homes",
      logo: "https://i.pravatar.cc/40?img=22",
      url: "https://example.com/greenfield",
    },
    propertyUrl: "/properties/456-oak-avenue",
  },
  {
    id: 3,
    address: "789 Cedar Lane",
    date: "2026-04-20",
    time: "09:00",
    type: "virtual",
    meetLink: "https://meet.google.com/xyz-uvwx-yz1",
    agency: {
      name: "Prime Properties",
      logo: "https://i.pravatar.cc/40?img=33",
      url: "https://example.com/prime",
    },
    propertyUrl: "/properties/789-cedar-lane",
  },
  {
    id: 4,
    address: "22 Birch Blvd",
    date: "2026-04-22",
    time: "13:00",
    type: "in_person",
    agency: {
      name: "Apex Realty",
      logo: "https://i.pravatar.cc/40?img=44",
      url: "https://example.com/apex",
    },
    propertyUrl: "/properties/22-birch-blvd",
  },
  {
    id: 5,
    address: "55 Maple Court",
    date: "2026-04-25",
    time: "16:00",
    type: "virtual",
    meetLink: "https://meet.google.com/pqr-stuv-wx2",
    agency: {
      name: "Harbor Homes",
      logo: "https://i.pravatar.cc/40?img=55",
      url: "https://example.com/harbor",
    },
    propertyUrl: "/properties/55-maple-court",
  },
];

const TODAY_VIEWINGS: ActiveViewing[] = [
  {
    id: 6,
    address: "88 Elm Street",
    date: "2026-03-28",
    time: "11:00",
    type: "virtual",
    meetLink: "https://meet.google.com/tod-ay00-001",
    agency: {
      name: "Vista Group",
      logo: "https://i.pravatar.cc/40?img=66",
      url: "https://example.com/vista",
    },
    propertyUrl: "/properties/88-elm-street",
  },
  {
    id: 7,
    address: "9 Willow Way",
    date: "2026-03-28",
    time: "15:30",
    type: "in_person",
    agency: {
      name: "Urban Nest",
      logo: "https://i.pravatar.cc/40?img=77",
      url: "https://example.com/urban",
    },
    propertyUrl: "/properties/9-willow-way",
  },
];

const PAST_VIEWINGS: PastViewing[] = [
  {
    id: 8,
    address: "789 Pine Road",
    date: "2026-03-10",
    time: "15:00",
    type: "in_person",
    agency: {
      name: "Bright Realty",
      logo: "https://i.pravatar.cc/40?img=88",
      url: "https://example.com/bright",
    },
    propertyUrl: "/properties/789-pine-road",
    rated: false,
  },
  {
    id: 9,
    address: "12 Spruce Ave",
    date: "2026-03-05",
    time: "12:00",
    type: "virtual",
    agency: {
      name: "Skyline Realty",
      logo: "https://i.pravatar.cc/40?img=11",
      url: "https://example.com/skyline",
    },
    propertyUrl: "/properties/12-spruce-ave",
    rated: true,
    rating: 4,
    comment: "Great virtual tour experience!",
  },
  {
    id: 10,
    address: "34 Aspen Close",
    date: "2026-02-28",
    time: "10:00",
    type: "in_person",
    agency: {
      name: "Greenfield Homes",
      logo: "https://i.pravatar.cc/40?img=22",
      url: "https://example.com/greenfield",
    },
    propertyUrl: "/properties/34-aspen-close",
    rated: false,
  },
];

const PAGE_SIZE = 2;

const STAR_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-3 h-3 text-slate-400 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className={`text-[28px] cursor-pointer select-none transition-colors duration-150 leading-none ${
            n <= (hovered || value) ? "text-amber-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({ viewing, onClose, onSubmit }: RatingModalProps) {
  const [stars, setStars] = useState<number>(viewing.rating ?? 0);
  const [comment, setComment] = useState<string>(viewing.comment ?? "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] mx-4 shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[11px] font-semibold text-blue-600 tracking-widest uppercase mb-1">
              Rate your viewing
            </p>
            <h3 className="text-lg font-bold text-slate-900 m-0 leading-snug">
              {viewing.address}
            </h3>
            <p className="text-[13px] text-slate-500 mt-1">
              {fmt(viewing.date)} · {viewing.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-sm cursor-pointer border-0"
          >
            ✕
          </button>
        </div>

        {/* Stars */}
        <div className="mb-5">
          <p className="text-[13px] font-semibold text-gray-700 mb-2">
            Overall experience
          </p>
          <StarRating value={stars} onChange={setStars} />
          <p className="text-xs text-slate-400 mt-1.5 h-4">
            {stars ? STAR_LABELS[stars] : "Tap to rate"}
          </p>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <p className="text-[13px] font-semibold text-gray-700 mb-2">
            Comments
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this property viewing…"
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 resize-y outline-none transition-colors duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!stars}
            onClick={() => onSubmit(viewing.id, stars, comment)}
            className={`flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-150 border-0 ${
              stars
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Active Card (Upcoming / Today) ────────────────────────────────────────────
function ActiveCard({ v }: ActiveCardProps) {
  const isVirtual = v.type === "virtual";

  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white transition-all duration-200 hover:shadow-[0_4px_20px_rgba(37,99,235,0.10)] hover:border-blue-200">
      {/* Top row */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <Link
            href={v.propertyUrl}
            className="text-base font-bold text-slate-900 no-underline hover:text-blue-600 transition-colors"
          >
            {v.address}
          </Link>
          <div className="flex gap-3.5 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <CalendarIcon /> {fmt(v.date)}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <ClockIcon /> {v.time}
            </span>
          </div>
        </div>

        {/* Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
            isVirtual
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : "bg-green-50 text-green-600 border-green-200"
          }`}
        >
          {isVirtual ? "📹 Virtual" : "🏠 In-Person"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-3.5" />

      {/* Agency + actions */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <a
          href={v.agency.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 no-underline px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all duration-150"
        >
          <img
            src={v.agency.logo}
            alt={v.agency.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-[13px] font-semibold text-slate-900">
            {v.agency.name}
          </span>
          <ExternalLinkIcon />
        </a>

        <div className="flex gap-2 items-center flex-wrap">
          <Link
            href={v.propertyUrl}
            className="text-[13px] font-semibold text-blue-600 no-underline px-3.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View Property →
          </Link>

          {isVirtual && v.meetLink && (
            <a
              href={v.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-white no-underline px-3.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
            >
              <VideoIcon /> Join Meet
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Past Card ─────────────────────────────────────────────────────────────────
function PastCard({ v, onRate }: PastCardProps) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 transition-all duration-200 hover:shadow-sm hover:border-slate-300">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <Link
            href={v.propertyUrl}
            className="text-base font-bold text-gray-700 no-underline hover:text-blue-600 transition-colors"
          >
            {v.address}
          </Link>
          <div className="flex gap-3.5 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <CalendarIcon /> {fmt(v.date)} · {v.time}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          {v.type === "virtual" ? "📹 Virtual" : "🏠 In-Person"}
        </span>
      </div>

      <div className="h-px bg-slate-200 my-3.5" />

      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <a
          href={v.agency.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 no-underline px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors"
        >
          <img
            src={v.agency.logo}
            alt={v.agency.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-[13px] font-semibold text-gray-700">
            {v.agency.name}
          </span>
        </a>

        <div className="flex gap-2 items-center">
          {v.rated ? (
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-sm leading-none">
                {"★".repeat(v.rating ?? 0)}
                {"☆".repeat(5 - (v.rating ?? 0))}
              </span>
              <span className="text-xs text-slate-500">Reviewed</span>
            </div>
          ) : (
            <button
              onClick={() => onRate(v)}
              className="text-[13px] font-semibold text-blue-600 cursor-pointer px-3.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              ⭐ Rate Viewing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ total, page, onPage }: PaginationProps) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-1.5 mt-5">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={`w-[34px] h-[34px] rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-150 border ${
            n === page
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-gray-700 border-slate-200 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.25)]"
          : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900"
      }`}
    >
      {label}
      <span
        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/25 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const DashboardSchedule = () => {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [pages, setPages] = useState<Record<TabKey, number>>({
    upcoming: 1,
    today: 1,
    past: 1,
  });
  const [ratingTarget, setRatingTarget] = useState<PastViewing | null>(null);
  const [pastData, setPastData] = useState<PastViewing[]>(PAST_VIEWINGS);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewings, setViewings] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );

  const fetchViewings = async (pageNumber = 1, pageSize = 10) => {
    setIsLoading(true);

    try {
      const response = await new ApiRequests().fetchCustomerViewingSchedule(
        pageNumber,
        pageSize
      );
      if (response.success) {
        const { data, paginationControl } = response;
        setViewings(data);
        setPagination(paginationControl);
        setIsLoading(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const loadData = async (page = 1) => {
    await fetchViewings(page);
  };

  useEffect(() => {
    loadData();
  }, []);

  const setPage = (t: TabKey, p: number) =>
    setPages((prev) => ({ ...prev, [t]: p }));

  const paginate = <T,>(arr: T[], t: TabKey): T[] => {
    const p = pages[t];
    return arr.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  };

  const handleRateSubmit = (id: number, stars: number, comment: string) => {
    setPastData((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, rated: true, rating: stars, comment } : v
      )
    );
    setRatingTarget(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Scheduled Viewings
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Manage and track all your property viewings
      </p>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 bg-slate-100 rounded-2xl w-fit mb-6">
        <TabButton
          label="Upcoming"
          count={UPCOMING.length}
          active={tab === "upcoming"}
          onClick={() => setTab("upcoming")}
        />
        <TabButton
          label="Today"
          count={TODAY_VIEWINGS.length}
          active={tab === "today"}
          onClick={() => setTab("today")}
        />
        <TabButton
          label="Past"
          count={pastData.length}
          active={tab === "past"}
          onClick={() => setTab("past")}
        />
      </div>

      {/* ── Upcoming ── */}
      {tab === "upcoming" && (
        <div>
          <div className="flex flex-col gap-3">
            {paginate(UPCOMING, "upcoming").map((v) => (
              <ActiveCard key={v.id} v={v} />
            ))}
          </div>
          <Pagination
            total={UPCOMING.length}
            page={pages.upcoming}
            onPage={(p) => setPage("upcoming", p)}
          />
        </div>
      )}

      {/* ── Today ── */}
      {tab === "today" && (
        <div>
          {TODAY_VIEWINGS.length === 0 ? (
            <p className="text-center py-12 text-slate-400 text-sm">
              No viewings scheduled for today.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {paginate(TODAY_VIEWINGS, "today").map((v) => (
                  <ActiveCard key={v.id} v={v} />
                ))}
              </div>
              <Pagination
                total={TODAY_VIEWINGS.length}
                page={pages.today}
                onPage={(p) => setPage("today", p)}
              />
            </>
          )}
        </div>
      )}

      {/* ── Past ── */}
      {tab === "past" && (
        <div>
          <div className="flex flex-col gap-3">
            {paginate(pastData, "past").map((v) => (
              <PastCard key={v.id} v={v} onRate={setRatingTarget} />
            ))}
          </div>
          <Pagination
            total={pastData.length}
            page={pages.past}
            onPage={(p) => setPage("past", p)}
          />
        </div>
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          viewing={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onSubmit={handleRateSubmit}
        />
      )}
    </div>
  );
};
