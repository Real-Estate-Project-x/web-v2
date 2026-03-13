import { LogoComponent } from "../components/pages/Home/Nav";
import Footer from "../components/pages/Home/Footer";
import Link from "next/link";

// Inline keyframe styles since Tailwind base doesn't include custom animations
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .font-display { font-family: 'DM Serif Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    100% { transform: translate(18px, 26px) scale(1.06); }
  }
  @keyframes pinBob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes windowBlink {
    0%, 88%, 100% { opacity: 1; }
    92%            { opacity: 0.12; }
  }
  @keyframes slideArrow {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(-4px); }
  }

  .anim-fade-up-1  { opacity: 0; animation: fadeUp 0.6s 0.15s ease forwards; }
  .anim-fade-up-2  { opacity: 0; animation: fadeUp 0.6s 0.30s ease forwards; }
  .anim-fade-up-3  { opacity: 0; animation: fadeUp 0.6s 0.45s ease forwards; }
  .anim-fade-up-4  { opacity: 0; animation: fadeUp 0.6s 0.60s ease forwards; }
  .anim-fade-up-5  { opacity: 0; animation: fadeUp 0.6s 0.75s ease forwards; }
  .anim-fade-up-6  { opacity: 0; animation: fadeUp 0.6s 0.90s ease forwards; }
  .anim-fade-down  { opacity: 0; animation: fadeDown 0.6s 0.10s ease forwards; }

  .blob { animation: drift 11s ease-in-out infinite alternate; }
  .blob-2 { animation-delay: -4s; }
  .blob-3 { animation-delay: -8s; }

  .pin-bob { animation: pinBob 2.4s ease-in-out infinite; }
  .window-blink  { animation: windowBlink 4s ease-in-out infinite; }
  .window-blink2 { animation: windowBlink 4s 1.1s ease-in-out infinite; }

  .btn-arrow { transition: transform 0.2s ease; }
  .go-back-btn:hover .btn-arrow { animation: slideArrow 0.5s ease; }
  .go-back-btn { transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease; }
  .go-back-btn:hover { transform: translateY(-2px); }
  .go-back-btn:active { transform: translateY(0); }
`;

// ── House SVG ────────────────────────────────────────────────────────────────
function HouseIllustration() {
  return (
    <svg
      viewBox="0 0 200 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-36 h-auto select-none"
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="177" rx="58" ry="7" fill="rgba(13,31,60,0.09)" />

      {/* House body */}
      <rect
        x="36"
        y="90"
        width="128"
        height="85"
        rx="5"
        fill="#EAF2FB"
        stroke="#1A4B8C"
        strokeWidth="2.5"
      />

      {/* Roof fill */}
      <path d="M20 96 L100 26 L180 96Z" fill="#1A4B8C" />
      {/* Roof outline */}
      <path
        d="M20 96 L100 26 L180 96"
        stroke="#0D1F3C"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Chimney */}
      <rect x="130" y="40" width="14" height="28" rx="2" fill="#0D1F3C" />
      <rect x="127" y="38" width="20" height="6" rx="2" fill="#0D1F3C" />

      {/* Ridge cap */}
      <rect x="88" y="22" width="24" height="9" rx="3" fill="#E8A94D" />

      {/* Door */}
      <rect x="80" y="130" width="40" height="45" rx="5" fill="#1A4B8C" />
      <circle cx="114" cy="153" r="3.5" fill="#E8A94D" />
      {/* Door arch top */}
      <path d="M80 135 Q100 120 120 135" fill="#0D1F3C" />

      {/* Question mark on door */}
      <text
        x="100"
        y="158"
        textAnchor="middle"
        fontFamily="DM Serif Display, serif"
        fontSize="20"
        fill="white"
        opacity="0.65"
      >
        ?
      </text>

      {/* Left window */}
      <rect
        x="44"
        y="104"
        width="36"
        height="30"
        rx="3"
        fill="#3B82C4"
        className="window-blink"
      />
      <line
        x1="62"
        y1="104"
        x2="62"
        y2="134"
        stroke="white"
        strokeWidth="1.5"
      />
      <line
        x1="44"
        y1="119"
        x2="80"
        y2="119"
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Right window */}
      <rect
        x="120"
        y="104"
        width="36"
        height="30"
        rx="3"
        fill="#3B82C4"
        className="window-blink2"
      />
      <line
        x1="138"
        y1="104"
        x2="138"
        y2="134"
        stroke="white"
        strokeWidth="1.5"
      />
      <line
        x1="120"
        y1="119"
        x2="156"
        y2="119"
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Floating search pin */}
      <g className="pin-bob" transform="translate(148, 32)">
        <circle cx="15" cy="15" r="13" fill="#E8A94D" />
        <circle cx="15" cy="14" r="5.5" fill="white" />
        <line
          x1="19"
          y1="18"
          x2="24"
          y2="23"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M15 28 L15 33"
          stroke="#E8A94D"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>
    </svg>
  );
}

// ── Background blobs ──────────────────────────────────────────────────────────
function Blobs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1A4B8C 1px, transparent 1px), linear-gradient(90deg, #1A4B8C 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Blobs */}
      <div className="blob absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[#a8cef5] opacity-30 blur-[72px]" />
      <div className="blob blob-2 absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-[#f5d89a] opacity-25 blur-[64px]" />
      <div className="blob blob-3 absolute bottom-[18%] right-[8%] w-[240px] h-[240px] rounded-full bg-[#bfe0ff] opacity-30 blur-[56px]" />
    </div>
  );
}

// ── Main 404 Component ────────────────────────────────────────────────────────
export default function NotFound() {
  return (
    <>
      <style>{styles}</style>

      <div
        className="font-body relative min-h-screen flex flex-col items-center justify-center text-center px-5 py-20 pt-5 overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, #dceeff 0%, #F7F4EF 52%, #f0e8d8 100%)",
        }}
      >
        <Blobs />

        {/* Logo */}
        <LogoComponent />

        {/* Content card — sits above blobs */}
        <div className="relative z-10 flex flex-col items-center">
          {/* House */}
          <div className="mb-6 anim-fade-down">
            <HouseIllustration />
          </div>

          {/* Pill tag */}
          <span className="anim-fade-up-1 inline-block bg-[#E8A94D] text-white text-[0.68rem] font-semibold tracking-[0.12em] uppercase px-4 py-1 rounded-full mb-4 shadow-sm">
            Page not found
          </span>

          {/* 404 */}
          <div
            className="anim-fade-up-2 font-display leading-none tracking-tighter mb-1 select-none"
            style={{
              fontSize: "clamp(5.5rem, 14vw, 9.5rem)",
              background: "linear-gradient(135deg, #0D1F3C 30%, #3B82C4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up-3 font-display text-[#0D1F3C] mb-3"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}
          >
            This page does not exist
          </h1>

          {/* Subtext */}
          <p
            className="anim-fade-up-4 text-[#6B7E96] font-light leading-relaxed max-w-sm mb-9"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
          >
            Looks like you've wandered into an empty lot. The page you're
            looking for may have moved or been taken off the market.
          </p>

          {/* Go Back button */}
          <Link
            href="/"
            className="go-back-btn anim-fade-up-5 flex items-center gap-2.5 bg-[#1A4B8C] hover:bg-[#0D1F3C] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-[#1A4B8C]/25 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] focus-visible:ring-offset-2"
            style={{ fontSize: "0.95rem", letterSpacing: "0.01em" }}
            aria-label="Go back to previous page"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 btn-arrow"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back&nbsp;To&nbsp;Home
          </Link>

          {/* Secondary link */}
          <p className="anim-fade-up-6 mt-5 text-[#6B7E96] text-sm">
            Or{" "}
            <Link
              href="/properties"
              className="text-[#3B82C4] font-medium hover:underline transition-colors"
            >
              search available properties
            </Link>{" "}
            on Blupodd
          </p>
        </div>

        {/* Footer */}
        {/* <Footer/> */}
        <p className="absolute bottom-4 text-[#6B7E96] text-sm anim-fade-up-6 z-10">
          © {new Date().getFullYear()} Blupodd.com · Seamless Integration. Home
          Hunting, Reimagined.
          <p>All Rights Resolved</p>
        </p>
      </div>
    </>
  );
}
