'use client';

import { FC, ReactNode } from "react";
import { StepSetUpForOnboarding } from "../shared";
import { usePathname, useSearchParams } from "next/navigation";

// Hero real estate image (white concrete building during daytime)
const HERO_IMG = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80";

type props = {
    children : ReactNode;
}
const AuthLayout : FC<props> = ({children}) => {
  //bg-[#0253CC] bg-gradient-to-br from-purple-light to-white
  const pathname = usePathname();
  const type  =  useSearchParams()?.get('type');
  
  return (
    <div className="h-screen w-full ">
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row items-stretch overflow-hidden bg-white/70 backdrop-blur-sm border border-gray-100 w-full">
          {/* Left: Image - hidden on mobile */}
          <div className="hidden md:block md:w-[45%] relative">
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
          <div className="flex-grow flex items-start justify-start pb-8 px-6 md:px-10">
            <div className="py-4">
               {pathname?.includes('signUp') &&
                  <StepSetUpForOnboarding pathname={pathname} type={type ?? ''}/>
                }
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

