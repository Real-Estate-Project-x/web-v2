import Image from "next/image";
import { useEffect } from "react";
import { AgencyInterface } from "../../../utils/interfaces";

interface Props {
  agency: AgencyInterface;
}

export default function AgencySnippetCard({ agency }: Props) {
  let logoUrl = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6";

  useEffect(() => {
    if (agency["logo"]) {
      logoUrl = (agency["logo"] as any)["url"];
    }
  }, []);

  return (
    <>
      {/* your agent card here */}
      <div className="w-full lg:max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
          <Image
            alt="Agency logo"
            width={20}
            height={20}
            src={logoUrl}
            className="w-20 h-20 mx-auto rounded-full border-4 border-white object-cover shadow-md"
          />
          <h3 className="mt-4 text-xl font-semibold">
            {String(agency.name).toUpperCase()}
          </h3>
          <p className="text-sm text-blue-100">Trusted Real Estate Experts</p>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            {agency.description}
          </p>

          <div className="border-t border-gray-100"></div>

          <div className="grid grid-cols-3 gap-3 text-sm font-medium">
            <a
              //   href="mailto:info@primerealty.com"
              href={`mailto:${agency.email}`}
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              📧
              <span className="mt-1 text-gray-600">Email</span>
            </a>

            <a
              //   href="https://wa.me/2348012345678"
              href={`https://wa.me/${
                agency.whatsappNumber ?? agency.agencyPhoneNumber
              }`}
              target="_blank"
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-green-50 hover:bg-green-100 transition"
            >
              💬
              <span className="mt-1 text-green-600">WhatsApp</span>
            </a>

            <a
              //   href="tel:+2348012345678"
              href={`tel:${agency.agencyPhoneNumber}`}
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
            >
              📞
              <span className="mt-1 text-blue-600">Call</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
