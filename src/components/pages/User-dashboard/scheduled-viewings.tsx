import { useEffect, useState } from "react";
import { ScheduledViewing } from "@/components/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { PropertyViewingFilter } from "@/lib/constants";
import { axiosInstance } from "@/lib/axios-interceptor";

export const DashboardSchedule = () => {
  const [activeTab, setActiveTab] = useState("today");
  const TABS = [
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (filter = PropertyViewingFilter.ALL) => {
    const url = `/agent-property-viewing/customer/viewing-list?filter=${filter}`;
    const result = await axiosInstance.get(url);
    if (result?.data?.success) {
      const { data } = result.data;
      console.log({ data });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Scheduled Viewings</h1>
      <div className="flex gap-2 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-4 py-2 cursor-pointer
              ${
                activeTab === tab.key
                  ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "today" && (
        <section data-section="today" className="container">
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              {/* <!-- Viewing Type Badge --> */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    bg-blue-100 text-blue-700"
              >
                Virtual
              </span>
            </div>

            {/* <!-- Property Link --> */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            {/* <!-- Agency Info --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            {/* <!-- Virtual Viewing Section --> */}
            <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Virtual Viewing Link
              </p>
              <a
                href="https://meet.google.com/abc-defg-hij"
                target="_blank"
                className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm"
              >
                🔗 Join Google Meet
              </a>
            </div>

            {/* <!-- Actions --> */}
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Reschedule
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        bg-green-100 text-green-700"
              >
                In-Person
              </span>
            </div>

            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Reschedule
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === "upcoming" && (
        <section data-section="upcoming" className="container">
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              {/* <!-- Viewing Type Badge --> */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    bg-blue-100 text-blue-700"
              >
                Virtual
              </span>
            </div>

            {/* <!-- Property Link --> */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            {/* <!-- Agency Info --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            {/* <!-- Virtual Viewing Section --> */}
            <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Virtual Viewing Link
              </p>
              <a
                href="https://meet.google.com/abc-defg-hij"
                target="_blank"
                className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm"
              >
                🔗 Join Google Meet
              </a>
            </div>

            {/* <!-- Actions --> */}
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Reschedule
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              {/* <!-- In-person Badge --> */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        bg-green-100 text-green-700"
              >
                In-Person
              </span>
            </div>

            {/* <!-- Property Link --> */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            {/* <!-- Agency Info --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            {/* <!-- Actions --> */}
            <div className="flex justify-end gap-3 pt-2">
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Reschedule
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === "past" && (
        <section data-section="past" className="container">
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              {/* <!-- Viewing Type Badge --> */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    bg-blue-100 text-blue-700"
              >
                Virtual
              </span>
            </div>

            {/* <!-- Property Link --> */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            {/* <!-- Agency Info --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border p-5 opacity-75">
              <p className="text-sm text-gray-500">
                Viewing completed on Monday, 4th November · 10:00 AM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
            {/* <!-- Header --> */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Viewing Date</p>
                <p className="font-semibold text-gray-900">
                  Thursday, 11th November · 2:30 PM
                </p>
              </div>

              {/* <!-- In-person Badge --> */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        bg-green-100 text-green-700"
              >
                In-Person
              </span>
            </div>

            {/* <!-- Property Link --> */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                3-Bedroom Apartment, Lekki Phase 1
              </a>
            </div>

            {/* <!-- Agency Info --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Agency</p>
                <p className="font-medium text-gray-800">Prime Homes Realty</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">+234 812 345 6789</p>
              </div>
            </div>

            {/* <!-- Actions --> */}
            <div className="bg-gray-50 rounded-xl border p-5 opacity-75">
              <p className="text-sm text-gray-500">
                Viewing completed on Monday, 4th November · 10:00 AM
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
