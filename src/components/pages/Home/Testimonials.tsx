'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Buyer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Working with Abode to find my first home was an incredible experience. My agent was patient, knowledgeable, and found me exactly what I was looking for within my budget.",
  },
  {
    id: 2,
    name: "David Martinez",
    role: "Property Seller",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    content:
      "Abode helped me sell my property for well above the asking price. Their marketing strategy and negotiation skills are unmatched. I couldn't be happier with the results.",
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Real Estate Investor",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    content:
      "I've worked with many real estate agencies, but Abode truly stands out. Their market analysis and investment advice have helped me make smart decisions that improved my portfolio.",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-real-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy-900 mb-4">
            Our Top Rated Agents
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto font-light">
            We take pride in providing exceptional service to our clients. Here&apos;s a list of our top Agents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="testimonial-card bg-white rounded-xl shadow-lg p-8 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <Image
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].name}
                className="w-16 h-16 rounded-full object-cover mx-auto md:mx-0 mb-4 md:mb-0"
                width={0}
                height={0}
              />
              <div className="md:ml-4 text-center md:text-left">
                <h4 className="text-xl font-semibold text-navy-900">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-navy-600">{testimonials[activeIndex].role}</p>
              </div>
            </div>
            <p className="text-navy-800 text-lg italic font-light">
              &quot;{testimonials[activeIndex].content}&quot;
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant={index === activeIndex ? "default" : "outline"}
                size="sm"
                className={index === activeIndex ? "w-10 h-10 rounded-full bg-[#0253CC]" : "w-10 h-10 rounded-full "}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {index + 1}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
