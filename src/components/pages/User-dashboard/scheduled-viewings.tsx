import { useEffect, useState } from "react";
import { PropertyViewingFilter } from "@/lib/constants";
import { axiosInstance } from "@/lib/axios-interceptor";
import ScheduledViewingCard from "@/components/shared/scheduled-viewing-card";

export const DashboardSchedule = () => {
  const [viewings, setViewings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(PropertyViewingFilter.TODAY);
  const TABS = [
    { key: PropertyViewingFilter.TODAY, label: "Today" },
    { key: PropertyViewingFilter.UPCOMING, label: "Upcoming" },
    { key: PropertyViewingFilter.PAST, label: "Past" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (filter = PropertyViewingFilter.TODAY) => {
    const url = `/agent-property-viewing/customer/viewing-list?filter=${filter}`;
    const result = await axiosInstance.get(url);
    if (result?.data?.success) {
      setViewings(result.data.data);
    }
  };

  const loadData = async (filter = PropertyViewingFilter.TODAY) => {
    setViewings([]);
    setActiveTab(filter);
    fetchData(filter);
  };

  const rescheduleViewing = async (viewing: any, reason: string) => {
    console.log({ viewing, reason });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Scheduled Viewings</h1>
      <div className="flex gap-2 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => loadData(tab.key)}
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

      {activeTab === PropertyViewingFilter.TODAY && (
        <section className="container">
          {viewings.length > 0 ? (
            <div>
              {viewings.map((viewing: any) => (
                <ScheduledViewingCard
                  isPast={false}
                  key={viewing.id}
                  viewing={viewing}
                  onReschedule={rescheduleViewing}
                />
              ))}
            </div>
          ) : (
            <h1>No viewings found</h1>
          )}
        </section>
      )}

      {activeTab === PropertyViewingFilter.UPCOMING && (
        <section className="container">
          {viewings.length > 0 ? (
            <div>
              {viewings.map((viewing: any) => (
                <ScheduledViewingCard
                  isPast={false}
                  key={viewing.id}
                  viewing={viewing}
                  onReschedule={rescheduleViewing}
                />
              ))}
            </div>
          ) : (
            <h1>No viewings found</h1>
          )}
        </section>
      )}

      {activeTab === PropertyViewingFilter.PAST && (
        <section className="container">
          {viewings.length > 0 ? (
            <div>
              {viewings.map((viewing: any) => (
                <ScheduledViewingCard
                  isPast={true}
                  key={viewing.id}
                  viewing={viewing}
                />
              ))}
            </div>
          ) : (
            <h1>No viewings found</h1>
          )}
        </section>
      )}
    </div>
  );
};
