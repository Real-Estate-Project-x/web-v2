'use client'

import { useState } from "react";
import { LogoComponent } from "./Home/Nav";

const SUPPORTED_REGIONS = [
  { flag: "🇳🇬", name: "Nigeria" },
  { flag: "🇬🇭", name: "Ghana" },
  { flag: "🇰🇪", name: "Kenya" },
  { flag: "🇿🇦", name: "South Africa" },
  { flag: "🇬🇧", name: "Togo" },
];

const VPN_APPS = [
  { name: "NordVPN", url: "https://nordvpn.com" },
  { name: "ExpressVPN", url: "https://expressvpn.com" },
  { name: "Surfshark", url: "https://surfshark.com" },
];

export default function RegionNotSupported() {
  const [showVpnTip, setShowVpnTip] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16 font-sans">

      {/* Logo */}
      <div className="mb-12">
         <LogoComponent/>
        {/* <span className="font-serif text-2xl text-blue-900 tracking-tight select-none">
          Blu<span className="text-amber-400">podd</span>
        </span> */}
      </div>
     

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-3xl px-8 py-10 max-w-md w-full text-center shadow-sm">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            <path d="M6 6l12 12" strokeWidth="1.5" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl text-gray-900 tracking-tight mb-2">
          Region not supported
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          Blupodd isn't available in your country just yet. We're expanding fast — but for now, the platform is only accessible in a handful of supported regions.
        </p>

        {/* Supported regions */}
        <div className="bg-slate-50 rounded-2xl px-5 py-4 mb-6 text-left">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
            Available in
          </p>
          <div className="flex flex-col gap-2">
            {SUPPORTED_REGIONS.map((r) => (
              <div key={r.name} className="flex items-center gap-2.5">
                <span className="text-base">{r.flag}</span>
                <span className="text-sm text-gray-700">{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VPN section */}
        <div className="border border-dashed border-gray-200 rounded-2xl px-5 py-4 text-left">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowVpnTip((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Access via VPN</span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showVpnTip ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {showVpnTip && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                You can use a VPN to connect from a supported region. Set your server location to one of the countries above, then reload Blupodd.
              </p>
              <p className="text-xs font-medium text-gray-500 mb-2">Popular VPN options</p>
              <div className="flex flex-wrap gap-2">
                {VPN_APPS.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {app.name} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-gray-400 text-center max-w-xs leading-relaxed">
        We're working on bringing Blupodd to more regions.{" "}
        <a href="mailto:hello@blupodd.com" className="text-blue-800 hover:underline">
          Get notified
        </a>{" "}
        when we launch in your area.
      </p>

    </div>
  );
}
