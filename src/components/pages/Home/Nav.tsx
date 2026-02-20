"use client";

import { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Menu,
  Search,
  X,
  Building2,
  Users2,
  Contact,
  LockOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavDataInterface } from "../../../../utils/interfaces";

type NavData = {
  data?: NavDataInterface[];
};

const defaultNavData = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/agents", label: "Agents", icon: Users2 },
  { href: "/contact", label: "Contact", icon: Contact },
];
const Navbar: FC<NavData> = ({ data = defaultNavData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Handle scroll events to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7; // Approximately when the hero section ends
      if (window.scrollY > heroHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 shadow ${
        pathname === "/"
          ? scrolled
            ? "bg-white border-gray-200 text-gray-800 "
            : "bg-transparent border-transparent text-white"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* container */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          {/* <Home className={`h-8 w-8 mr-2 ${pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-black"}`} /> */}
          <h1 className={`text-2xl font-medium inline-block font-serif`}>
            <LogoComponent
              color={
                pathname === "/"
                  ? scrolled
                    ? "#1E3A8A"
                    : "#FFFFFF"
                  : "#1E3A8A"
              }
            />
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Map through defaultNavData to create links */}
          {data.map((navItem) => (
            <Link
              key={navItem.href}
              href={navItem.href}
              className={`hover:text-real-300 transition-colors flex items-center gap-1 ${
                pathname === "/"
                  ? scrolled
                    ? "text-[#1E3A8A] font-normal"
                    : "text-gray-200"
                  : pathname === navItem.href
                  ? "text-[#1E3A8A] font-semibold text-shadow-lg"
                  : "text-black"
              }`}
            >
              <navItem.icon size={18} className="inline-block mr-1" />
              {navItem.label}
            </Link>
          ))}
          <Link href={"/properties/search"}>
            <Search
              size={18}
              className={`${
                pathname === "/"
                  ? scrolled
                    ? "text-gray-800"
                    : "text-gray-200"
                  : "text-[#1E3A8A]"
              }`}
            />
          </Link>
          <Link
            href="/login"
            className={
              pathname.includes("/agent-dashboard") ? "hidden" : "inline-block"
            }
          >
            <Button
              variant="default"
              size="sm"
              className="ml-4 font-normal cursor-pointer bg-gradient-to-r from-[#1E3A8A] to-[#0253CC]"
            >
              Sign&nbsp;In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className={(scrolled || pathname !== "/")? "text-gray-800" : "text-slate-200"}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden shadow-lg animate-fade-in border-t border-b border-slate-200 ${
            // pathname === "/" ?
            // scrolled
            //   ? "bg-white border-gray-200"
            //   : "bg-black bg-opacity-80 backdrop-blur-md border-gray-700" :
            "bg-white border-gray-200"
          }`}
        >
          <div className="container mx-auto px-4 py-3 space-y-3">
            {data.map((navItem) => (
              <Link
                key={navItem.href}
                href={navItem.href}
                className={`block py-2 flex items-center gap-1 hover:text-real-300 transition-colors border-b border-slate-200 font-normal text-black`}
                // ${pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-black"}
              >
                <navItem.icon size={18} className="inline-block mr-1" />
                {navItem.label}
              </Link>
            ))}

            {/* <Link href={"/properties/search"}>
              <Search size={18} className="text-black"/>
           </Link> */}

            <Link
              href="/login"
              className="flex flex-row gap-2 items-center pt-2 text-black"
            >
              {/* <Button className="w-full mt-2 hover:bg-blue-800 bg-[#1E3A8A] text-white"> */}
              <LockOpen size={18} className="inline-block" />
              Sign&nbsp;In
              {/* </Button> */}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

export const LogoComponent = ({ color }: { color?: string }) => {
  return (
    // <div className="flex items-center gap-3 select-none">
    //   <p className="text-lg font-black tracking-widest text-muted-foreground">
    //     BL
    //   </p>

    //   <div className="relative flex items-center justify-center w-10 h-10 rounded-xl
    //     bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600
    //     text-white font-extrabold text-lg
    //     shadow-lg shadow-indigo-500/30
    //     transition-all duration-300
    //     hover:scale-110 hover:rotate-3">

    //     <span className="z-10">U</span>

    //     {/* Glow Ring */}
    //     <div className="absolute inset-0 rounded-xl
    //     bg-white/10 blur-md opacity-60"></div>
    //   </div>

    //   <p className="text-lg font-black tracking-widest text-muted-foreground">
    //     PODD
    //   </p>
    // </div>

    <div className="flex items-center gap-3 select-none font-serif">
      <p className={`text-xl font-semibold tracking-[0.4em] text-${color}`}>
        BL
      </p>
      {/* <div className="bg-black px-6 py-4 border-b border-blue-900/40"> */}
      <div
        className="relative flex items-center justify-center w-11 h-11 
        rounded-md
        bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
        text-white font-bold text-lg
        shadow-lg shadow-blue-900/40
        border border-blue-400/30
        transition-all duration-300 hover:scale-105">
        <span className="tracking-wide">U</span>

        {/* Architectural shine */}
        <div className="absolute inset-0 rounded-md bg-white/5 pointer-events-none"></div>
      </div>
      {/* </div> */}

      <p className={`text-xl font-semibold tracking-[0.4em] text-${color}`}>
        PODD
      </p>
    </div>
  );
};
