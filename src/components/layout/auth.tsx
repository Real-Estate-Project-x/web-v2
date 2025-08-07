'use client';

import Image from "next/image";
import { FC, ReactNode } from "react";

// Hero real estate image (white concrete building during daytime)
const HERO_IMG = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80";

type props = {
    children : ReactNode;
}
const AuthLayout : FC<props> = ({children}) => {
  //bg-[#0253CC] bg-gradient-to-br from-purple-light to-white
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center  md:p-8">
      <div className="flex flex-col md:flex-row items-stretch rounded-2xl shadow-2xl overflow-hidden bg-white/70 backdrop-blur-sm border border-gray-100 max-w-4xl w-full">
        {/* Left: Image - hidden on mobile */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={HERO_IMG}
            alt="Stylish modern building"
            className="object-cover w-full h-full min-h-[490px] transition-all duration-700"
            loading="eager"
            style={{ minHeight: 490, borderRight: "1px solid #F1F0FB" }}
          />
          {/* Add a colored lavender overlay */}
          <div
            className="absolute inset-0 bg-[#E5DEFF]/50"
            aria-hidden
          />
        </div>
        {/* Right: Signup Form */}
        <div className="flex-grow flex items-center justify-center py-8 px-6 md:px-10 bg-white bg-opacity-90">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

