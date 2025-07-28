
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CTA = () => {


  return (
    <section className="py-16 bg-[#243B53] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-8 md:mb-0 md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg text-gray-300 max-w-2xl">
              Connect with one of our expert agents today to start your journey toward finding the perfect property.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={"/agents"}>
              <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white">
                Contact an Agent
              </Button>
            </Link>
            <Link href={"/properties"}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#243B53]">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

