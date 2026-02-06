import { useState } from "react";
import { format } from "date-fns";

interface TimeWindow {
  id: string;
  timeSlot: string;
  isBooked: boolean;
}

interface DaySchedule {
  date: string;
  openWindows: TimeWindow[];
}

interface Props {
  data: DaySchedule[];
  onSelect?: (window: TimeWindow) => void;
}

export default function AvailabilitySchedule({ data, onSelect }: Props) {
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {data.map((day, idx) => (
        <div key={idx} className="bg-white rounded-xl border p-5">
          {/* Day Header */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(new Date(day.date), "EEEE, MMMM d")}
          </h3>

          {/* Time Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.openWindows.map((window) => (
              <button
                type="button"
                key={window.id}
                disabled={window.isBooked}
                onClick={() => {
                  onSelect?.(window);
                  setSelectedWindowId(window.id);
                }}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg border
                  text-sm font-medium transition
                  ${
                    window.isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedWindowId === window.id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-700 cursor-pointer"
                  }
                `}
              >
                <span>{window.timeSlot}</span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    window.isBooked
                      ? "bg-gray-300 text-gray-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {window.isBooked ? "Booked" : "Available"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
