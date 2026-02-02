import Link from "next/link";
import { formatPrettyDateTime } from "../../../utils/helpers";

interface Props {
  viewing: any;
  isPast: boolean;
  onReschedule?: (viewing: any, reason: string) => void;
}

export default function ScheduledViewingCard({
  viewing,
  isPast,
  onReschedule,
}: Props) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 space-y-4">
        {/* <!-- Header --> */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Viewing Date</p>
            <p className="font-semibold text-gray-900">
              {formatPrettyDateTime(viewing.availabilityWindow.startDateTime)}
            </p>
          </div>

          {/* <!-- Viewing Type Badge --> */}
          {viewing.medium === "VIRTUAL" ? (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          bg-blue-100 text-blue-700"
            >
              Virtual
            </span>
          ) : (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              bg-green-100 text-green-700"
            >
              In-Person
            </span>
          )}
        </div>

        {/* <!-- Property Link --> */}
        <div>
          <Link
            href={`/properties/view?id=${viewing.property.slug}`}
            className="text-indigo-600 font-medium hover:underline"
          >
            {viewing.property.title}
          </Link>
        </div>

        {/* <!-- Agency Info --> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Agency</p>
            <p className="font-medium text-gray-800">
              {viewing.property.agency.name}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Contact</p>
            <p className="font-medium text-gray-800">
              {viewing.property.agency.agencyPhoneNumber}
            </p>
            {viewing.property.agency?.whatsappNumber && (
              <>
                <p className="text-gray-500 pt-5">Whatsapp</p>
                <p className="font-medium text-gray-800">
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://wa.me/${viewing.property.agency.whatsappNumber}`}
                  >
                    {viewing.property.agency.whatsappNumber}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {isPast ? (
          <div className="bg-gray-50 rounded-xl border p-5 opacity-75">
            <p className="text-sm text-gray-500">
              Viewing completed on{" "}
              {formatPrettyDateTime(viewing.availabilityWindow.endDateTime)}
            </p>
          </div>
        ) : (
          <div>
            {viewing.medium === "VIRTUAL" && (
              <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Virtual Viewing Link
                </p>
                <Link
                  href={viewing.meetingLink}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm"
                >
                  🔗 Join Google Meet
                </Link>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href={`/properties/view?id=${viewing.property.slug}`}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                View More
              </Link>
              <button
                onClick={() => onReschedule?.(viewing, "Personal reasons")}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                Reschedule
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} // CEO Cast
