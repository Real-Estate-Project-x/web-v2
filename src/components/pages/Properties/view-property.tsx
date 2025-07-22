'use client';
import { Bed, Heart, MapPin, Mail, Phone, Calendar, Star, StarHalf, Wifi, Dumbbell, WashingMachine, MessageCircle, FileImage, FileText, Car, Video, Users } from "lucide-react";
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ContactAgentModal from "./Dialogs/Contact-agent";
import ScheduleViewingModal from "./Dialogs/schedule-viewing";
import { useSearchParams } from "next/navigation";
import React from "react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { API_BASE_URL } from "../home";
import { returnHeaders } from "@/lib/utils";
import { getCookie } from "@/lib/helpers";
import { CommentInterface, PropertyInterface } from "../../../../utils/interfaces";
import { formatPrice } from "../../../../utils/helpers";
import { LoaderViewProperty } from "@/components/shared/loader-cards";
import { ErrorDialog } from "@/components/shared/error-dialog";


// This would typically come from an API, using static data for now
// const getPropertyById = (id: string) => {
//   const properties = [
//     {
//       id: 1,
//       title: "Modern Luxury Villa",
//       price: "$1,250,000",
//       images: [
//         "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1595526051245-4506e0005bd0?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80"
//       ],
//       location: "Beverly Hills, CA",
//       beds: 4,
//       baths: 3,
//       sqft: "3,500",
//       type: "For Sale",
//       description: "Experience luxury living in this stunning modern villa. Features include high ceilings, premium finishes, and panoramic views. The property is surrounded by lush gardens and offers complete privacy while being just minutes away from exclusive restaurants and boutiques. The villa boasts a gourmet kitchen with top-of-the-line appliances, a spacious master suite with a spa-like bathroom, and a private terrace overlooking the infinity pool.",
//       features: ["Smart Home System", "Pool", "Wine Cellar", "Home Theater", "3-Car Garage"],
//       yearBuilt: 2020,
//       parkingSpaces: 3,
//       agentName: "John Smith",
//       rating: 4.5,
//       amenities: [
//         { id: 1, name: "Wi-Fi", icon: "wifi" },
//         { id: 2, name: "Gym", icon: "gym" },
//         { id: 3, name: "Washing Machine", icon: "washing-machine" }
//       ],
//       comments: [
//         { id: 1, userName: "Alice Johnson", date: "2024-12-15", text: "Beautiful property with amazing views. The kitchen is a dream for any home chef.", rating: 5 },
//         { id: 2, userName: "Robert Davis", date: "2024-12-10", text: "Great location, but I found some of the finishes to be less premium than described.", rating: 4 }
//       ],
//       architecturalDrawings: [
//         { id: 1, title: "Floor Plan - First Floor", type: "image", url: "https://images.unsplash.com/photo-1485996463739-9cb09adbe70f?auto=format&fit=crop&q=80" },
//         { id: 2, title: "Floor Plan - Second Floor", type: "image", url: "https://images.unsplash.com/photo-1484251065541-c9770829890f?auto=format&fit=crop&q=80" },
//         { id: 3, title: "Property Specifications", type: "document", url: "#" }
//       ],
//       agency: {
//         name: "Luxury Estates Group",
//         phone: "+1 (310) 555-7890",
//         email: "info@luxuryestatesgroup.com",
//         whatsapp: "+1 (310) 555-7891",
//         logo: "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?auto=format&fit=crop&q=80&w=200&h=200"
//       },
//       similarProperties : [{}]
//     },
//     {
//       id: 2,
//       title: "Downtown Apartment",
//       price: "$450,000",
//       images: [
//         "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80"
//       ],
//       location: "Downtown Seattle, WA",
//       beds: 2,
//       baths: 2,
//       sqft: "1,200",
//       type: "For Sale",
//       description: "Live in the heart of the city with this stylish apartment. Enjoy easy access to restaurants, shops, and entertainment. This modern unit features floor-to-ceiling windows with breathtaking city views, hardwood floors throughout, and an open concept living area perfect for entertaining. The kitchen has been recently updated with quartz countertops and stainless steel appliances. Building amenities include 24-hour concierge, fitness center, and a rooftop lounge.",
//       features: ["City Views", "Fitness Center", "Concierge", "Pet-Friendly", "In-Unit Laundry"],
//       yearBuilt: 2015,
//       parkingSpaces: 1,
//       agentName: "Emily Johnson",
//       rating: 4.0,
//       amenities: [
//         { id: 1, name: "Wi-Fi", icon: "wifi" },
//         { id: 2, name: "Gym", icon: "gym" }
//       ],
//       comments: [
//         { id: 1, userName: "Michael Brown", date: "2024-11-20", text: "Great city location with amazing views. Very convenient for city life.", rating: 4 }
//       ],
//       architecturalDrawings: [
//         { id: 1, title: "Floor Plan", type: "image", url: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80" }
//       ],
//       agency: {
//         name: "Urban Living Realty",
//         phone: "+1 (206) 555-4321",
//         email: "contact@urbanlivingrealty.com",
//         whatsapp: "+1 (206) 555-4322",
//         logo: "https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?auto=format&fit=crop&q=80&w=200&h=200"
//       },
//       similarProperties : [{}]
//     },
//     {
//       id: 3,
//       title: "Suburban Family Home",
//       price: "$750,000",
//       images: [
//         "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
//         "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80"
//       ],
//       location: "Bellevue, WA",
//       beds: 4,
//       baths: 2.5,
//       sqft: "2,800",
//       type: "For Sale",
//       description: "Perfect for families, this home offers a spacious layout with a large backyard and a quiet, friendly neighborhood. Recently renovated, this classic home combines modern amenities with timeless charm. The main floor features a bright, open living space, a formal dining room, and a gourmet kitchen with a breakfast nook. Upstairs you'll find four generous bedrooms including a master suite with a walk-in closet. The finished basement provides additional living space perfect for a home office, gym, or playroom.",
//       features: ["Large Backyard", "Excellent Schools", "Fireplace", "Gourmet Kitchen", "Close to Parks"],
//       yearBuilt: 2010,
//       parkingSpaces: 2,
//       agentName: "Michael Rodriguez",
//       rating: 4.8,
//       amenities: [
//         { id: 1, name: "Wi-Fi", icon: "wifi" },
//         { id: 3, name: "Washing Machine", icon: "washing-machine" }
//       ],
//       comments: [
//         { id: 1, userName: "Jennifer Wilson", date: "2024-12-05", text: "Beautiful family home in a great school district. The backyard is perfect for children.", rating: 5 },
//         { id: 2, userName: "Thomas Lee", date: "2024-11-28", text: "We loved the open floor plan and updated kitchen. Very family-friendly neighborhood.", rating: 5 }
//       ],
//       architecturalDrawings: [
//         { id: 1, title: "Floor Plan - Main Level", type: "image", url: "https://images.unsplash.com/photo-1604601633243-ea6119932da1?auto=format&fit=crop&q=80" },
//         { id: 2, title: "Landscape Design", type: "image", url: "https://images.unsplash.com/photo-1492567291473-fe3dfc175b45?auto=format&fit=crop&q=80" }
//       ],
//       agency: {
//         name: "Family Home Realtors",
//         phone: "+1 (425) 555-6789",
//         email: "info@familyhomerealtors.com",
//         whatsapp: "+1 (425) 555-6780",
//         logo: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=200&h=200"
//       },
//       similarProperties : [{}]
//     }
//   ];
  
//   // Generate mock similar properties based on the current property
//   const property = properties.find(p => p.id === Number(id));
//   if (property) {
//     // Get properties that aren't the current one
//     const otherProperties = properties.filter(p => p.id !== Number(id));
    
//     // Create a list of similar properties
//     property.similarProperties = [
//       ...otherProperties,
//       // Generate additional mock properties to have 10 similar properties
//       {
//         id: 4,
//         title: "Coastal Beach House",
//         price: "$1,100,000",
//         image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",
//         location: "Malibu, CA",
//         beds: 3,
//         baths: 2,
//         sqft: "2,000",
//         type: "For Sale",
//         lat: 34.0259,
//         lng: -118.7798
//       },
//       {
//         id: 5,
//         title: "Mountain View Cabin",
//         price: "$850,000",
//         image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80",
//         location: "Aspen, CO",
//         beds: 3,
//         baths: 2,
//         sqft: "1,800",
//         type: "For Sale",
//         lat: 39.1911,
//         lng: -106.8175
//       },
//       {
//         id: 6,
//         title: "Urban Loft",
//         price: "$550,000",
//         image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80",
//         location: "Portland, OR",
//         beds: 1,
//         baths: 1,
//         sqft: "950",
//         type: "For Sale",
//         lat: 45.5231,
//         lng: -122.6765
//       },
//       {
//         id: 7,
//         title: "Lakefront Property",
//         price: "$925,000",
//         image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
//         location: "Lake Tahoe, NV",
//         beds: 3,
//         baths: 2,
//         sqft: "2,200",
//         type: "For Sale",
//         lat: 39.0968,
//         lng: -120.0324
//       },
//       {
//         id: 8,
//         title: "Historic Townhouse",
//         price: "$780,000",
//         image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80",
//         location: "Boston, MA",
//         beds: 3,
//         baths: 2.5,
//         sqft: "1,950",
//         type: "For Sale",
//         lat: 42.3601,
//         lng: -71.0589
//       },
//       {
//         id: 9,
//         title: "Desert Oasis Home",
//         price: "$675,000",
//         image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80",
//         location: "Scottsdale, AZ",
//         beds: 3,
//         baths: 2,
//         sqft: "1,800",
//         type: "For Sale",
//         lat: 33.4942,
//         lng: -111.9261
//       },
//       {
//         id: 10,
//         title: "Glass House",
//         price: "$1,350,000",
//         image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80",
//         location: "Austin, TX",
//         beds: 4,
//         baths: 3.5,
//         sqft: "3,200",
//         type: "For Sale",
//         lat: 30.2672,
//         lng: -97.7431
//       }
//     ];
//   }
  
//   return property;
// };

// Form for requesting a tour
type TourFormData = {
  name: string;
  email: string;
  time: string;
  date: string;
  message: string;
};


const token = `U2FsdGVkX18b/X7yzwKyikKqVX3i0kwJiHV7Te7aYTqyIitK9o7ag8tG7Ok0pezIsGDPanXsv9SibfJ0lGGfqH0sOCB1dBVJNowf18q6lmz1TBCuc4CzSr2KQBqpSQpmVcjUP7gXD7nTb0Ygima+QqIlFzpN3RMPlJg9P9LSgIyNQ5BT4SQ3llcXfAqIUL3EmP87F/JlkEBImOujf4APeh0DBK71MAI/15PNBpDBzecz1ECRWoi8Ob8nMzTrHhSCRizF7oPJeQilBTEGgHJAemqarTuUqyTiVVPIzN2kq9C2Audsnp+Ccia3dB4MK+2dUVtR6OCJ/zYgbz7J9GLlqm1ncnwgt5mobV3qaseEl2OsTjv+Hx/yyDtKZ9lzv0JuGUzDyjW8wXqWtL6xntNshQmV4F/sseqvwKtFTx3QRyuKBg9Tuu6w+rCCtnaT1oKQPL+uWwkDBo+2/B2iOsIp/RGbYrszZepYZ5zoI5XIlAqAf2JXfPgUlT8xKCOgurwcKxuoJZbShMfZBrG8D5uXpg9OqkXAQg6a0gEvw4jHdUALPhWS8cTZdYLF//U4HXA/qufOIFOiKhKzmqGfDDPI4uESIT2J896pGeyF7U0+j4Ey4xcWmtpe4q13GE+S0/3BYrPnMjWAqwBLBdVW093xK0CgmxV4lF0XFoZVb0m0/C8nlvLLfIoMxLmnl/W/PnEJjqFIz+rC9fkVV5mTxx9CK58b+cttnDT15q7LJ4nPW1+xJD/Lv11uT1RX8FEED/zzotbbcIe2boEyXUwzbRRUQC8c+BuYkQuhc3o02874MbQZg4myc/XdWJgvLT9SL5ZZRK6hqbTC8QzQco45b+wY/9VWGLIkrylE7fohlnNDWlvB7CVbwUT9HppTQLEI0axkP0yv/LZdbPBwealpjK7kDaAWvaRZdBR4k7chhW1lHaVGhHYzo8SnVvYV4JzZAu2HYli4p39okCtOmYrtyD0Pye3CLh2QYAkm98yTGEQYcXmaOXdr/Lze+RYVJssSAhloxGR6g5c+h1w3w2UZfYpynzrIOy+jE8MmKTrzgXctwTlwECtbwjPbaYxI5eK6mqYzic5iykjmQZJszgaST7tPNHnv6S9SfDWbpp+LcmUYIOGlWfV37ynJilcQlP2n4va51kuCBvRae3PyaAKibDPW2DbqYx58Z+N7wgHs33SHfH2N+w3ReWhb/kQSORHQ1zuRKau6y7+4uAoRcRwKkjTcaqbz1uYVMFCgfj96XvKXluJ9A43TIXsV3Fikjmzkch6b8xDCMmsifsS5u+FMhwEtp5BlxG7dufs4rqd/ihi2S1I6dj4tISv5fjtZ6m7FkVx3sQHBr1tyY2QkOW5f500zo5gIw7EWwHpnIEwRBGJ/xabuS9XOARuTyMl28aGjFR0WIwTzIuCj8KAHcyvL7My3TEbtXgs2WdAdHIxm98RsFKLDiEaRDZKqvZVPDZHAmv/x0f0g0v3jvuxicvKRzQT5UG23yojMMvytzED+wEI4pg/XvmACjyeX9uUyb3qptC2Y36sn4VEDXLSq08rbEDP+c+3MgARvlZI3vY20c0eQtpNQm6PyFe5kpEGHfsGSp+08f8KEvGoCVyDHxp8JOYBSgLntM6vRlC7cfmMkjE7/ZLsvEv8P9XeSCtkQoPgFzZ5OjfIy91qINjadgNLMyUZrHSiW/BRnSeDhGB8w1ToRVYHA6H4kcCM+K9SUMSDnqbagda9pB24PHHk+M12tD+Ccfk5xsA/tjxSqn8Y8qX64SSzwYnCQE6YwSA3T+IhRv8zRTe7JBWPpRDmZKyx8S0LptQ==`
const PropertyDetails = () => {
  const searchParams = useSearchParams();
//const router = useRouter();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAgencyDetails, setShowAgencyDetails] = useState(false);
  const [rating, setRating] = useState(0);
  const [propertyData, setProperty] = useState<PropertyInterface>({} as PropertyInterface);
  const [comments, setComments] = useState<CommentInterface[]>([] as CommentInterface[]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorObj] = useState<{msg : string, flag : boolean}>({msg : "", flag :false});
  
  // Form for tour request
  const tourForm = useForm<TourFormData>({
    defaultValues: {
      name: "",
      email: "",
      time: "",
      date: "",
      message: ""
    }
  });

  // Form for comment submission
  const commentForm = useForm<{comment : string, rating : number}>({
    defaultValues: {
      comment: "",
      rating: 0
    }
  });

  const onSubmitTourRequest = (data: TourFormData) => {
    console.log("Tour request submitted:", data);
    toast.success("Tour request submitted successfully!");
    tourForm.reset();
  };

  const onSubmitComment = (data: {comment : string, rating : number}) => {
    // if a user is not logged in and has not viewed the apartment, user cannot make a comment
    setIsLoading(true);
    axios.post(`${API_BASE_URL}agent-property-viewing/rate-viewing`,{
      propertyViewingId: propertyData.id,
      rating,
      comment:data.comment
    }, {headers : {
        "Authorization" : `Bearer ${token}`,
        ...returnHeaders()
    }})
    .then((response) => {
        if(response?.data?.success){
          toast.success("Thank you for your review!");
        }else{
          setErrorObj({...errorMsg, flag : true, msg : response?.data?.message});
        }
        setIsLoading(false);
    }).catch((err) => {
        setErrorObj({...errorMsg, flag : true, msg : err?.response?.data?.message.includes("Property viewing with this id not found") 
          ? "Only Confirmed viewers of this property can make a comment." : err?.response?.data?.message
        });
        setIsLoading(false);
    });
    commentForm.reset();
    setRating(0);
  };

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Property saved to favorites!");
    } else {
      toast.info("Property removed from favorites.");
    }
  };


  // Helper function to render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-amber-400 text-amber-400" />);
    }
    
    return stars;
  };

  useEffect(() => { 
    axios.get(`${API_BASE_URL}property/customer-listings/detail/${searchParams.get('id')}`, {headers : returnHeaders(getCookie('user_ip'))})
      .then((response) => { 
          if(response.data.success) {
            setProperty(response.data.data?.property || {} as PropertyInterface);
            // get comments
            axios.get(`${API_BASE_URL}agent-property-viewing/user-ratings/${response.data.data?.property?.id}`, {headers : returnHeaders(getCookie('user_ip'))})
            .then((response) => { 
                if(response.data.success) {
                  setComments(response.data.data);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Error fetching properties:", error);
            });
          }
          setIsLoading(false);
      })
      .catch((error) => {
          setIsLoading(false);
          console.error("Error fetching properties:", error);
      });
      
   },[]);

  return (
    <React.Fragment>
      <Navbar/>
       {isLoading ? (<LoaderViewProperty />)
          :
          (
            <div className="min-h-screen bg-gray-50">
              <div className="container mx-auto px-4 py-8 mt-16">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl md:text-3xl font-semibold text-navy-900">{propertyData.title}</h1>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderRating(propertyData.bluepoddRating)}
                        <span className="ml-2 text-gray-600">({propertyData.bluepoddRating})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <p className="text-base capitalize">{new String(propertyData.address).toLowerCase()}</p>
                  </div>
                  
                  {/* Property Image Slider */}
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {propertyData?.photoUrls?.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative">
                              <img
                                src={image}
                                alt={`${propertyData.title} - Image ${index + 1}`}
                                className="w-full h-[350px] sm:h-[400px] md:h-[500px] object-cover rounded-lg"
                              />
                              {index === 0 && (
                                <>
                                  <Badge className="absolute top-4 left-4 bg-[#0253CC]">{propertyData.propertyType.name}</Badge>
                                  {propertyData.isNewBuilding && <Badge className="absolute top-4 left-16 bg-green-500 hover:bg-green-600">New</Badge>}
                                  <Badge className="absolute top-4 right-4 bg-white text-[#102A43]">{formatPrice(propertyData.price)}</Badge>
                                </>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </Carousel>
                    
                    {/* Save Property Button */}
                    <Button 
                      variant={isSaved ? "default" : "outline"}
                      size="icon"
                      className={`absolute bottom-4 right-4 rounded-full z-10 ${
                        isSaved ? "bg-real-600 hover:bg-real-700" : "bg-white hover:bg-gray-100"
                      }`}
                      onClick={handleSaveProperty}
                      title={isSaved ? "Remove from saved" : "Save property"}
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? "fill-white text-white" : "text-real-600"}`} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Property Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4 py-4 border-y">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Bed className="h-5 w-5 mr-2" />
                          <span className="text-lg font-semibold">{propertyData.noOfBedrooms}</span>
                        </div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{propertyData.noOfToilets}</div>
                        <p className="text-sm text-gray-600">Bath/Toilet(s)</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{propertyData.sizeInSquareFeet}</div>
                        <p className="text-sm text-gray-600">Square Feet</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">Description</h2>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base capitalize">{propertyData.description}</p>
                    </div>

                    {/* Amenities Section */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">Amenities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {propertyData.hasWifi && (
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                            <Wifi className="h-5 w-5 mr-2 text-real-600" />
                            <span className="text-sm md:text-base">Wi-Fi</span>
                          </div>
                        )}
                        {propertyData.hasGym && (
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                            <Dumbbell className="h-5 w-5 mr-2 text-real-600" />
                            <span className="text-sm md:text-base">Gym</span>
                          </div>
                        )}
                        {propertyData.hasLaundry && (
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                            <WashingMachine className="h-5 w-5 mr-2 text-real-600" />
                            <span className="text-sm md:text-base">Laundry&nbsp;services</span>
                          </div>
                        )}
                    
                        {propertyData.hasCctv && (
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                            <Video className="h-5 w-5 mr-2 text-real-600" />
                            <span className="text-sm md:text-base">CCtv</span>
                          </div>
                        )}
                        
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">Features</h2>
                      <div className="grid grid-cols-2 gap-2">
                        {propertyData.hasCarParking&& (
                          <div className="flex items-center text-gray-600 text-sm md:text-base">
                            <span className="mr-2">•</span>
                            {"Car Parking"}
                          </div>
                        )}
                        {propertyData.hasKidsPlayArea && (
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                            <span className="mr-2">•</span>
                            <span className="text-sm md:text-base">{"Kids Play Area"}</span>
                          </div>
                        )}
                      
                      </div>
                    </div>
                    {/* Video tag section*/}
                    {propertyData.videoUrl && 
                      <div className="my-4">
                        <p className="py-2 font-medium">Watch Property Video</p>
                        <video width="600" height="360" controls>
                          <source src={propertyData.videoUrl} type="video/mp4"/>
                        </video>
                        {/* <iframe 
                        width="640" 
                        height="360" 
                        src="https://www.jw.org/en/library/videos/#en/mediaitems/VODMovies/docid-502100006_1_VIDEO" 
                        frameborder="0" 
                        allowfullscreen
                        >
                      </iframe> */}
                      </div>
                    }
                    
                    {/* Architectural Drawings Section */}
                    {propertyData.architecturalPlanUrls && (
                      <div className="text-sm md:text-base">
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Architectural Drawings</h2>
                        <Tabs defaultValue="images">
                          <TabsList className="mb-4">
                            <TabsTrigger value="images">Floor Plans</TabsTrigger>
                            {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
                          </TabsList>
                          
                          <TabsContent value="images">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {propertyData.architecturalPlanUrls
                                //.filter(drawing => drawing.type === "image")
                                .map((drawing : string, i:number) => (
                                  <Card key={i} className="overflow-hidden">
                                    <div className="h-48 overflow-hidden">
                                      <img 
                                        src={drawing} 
                                        alt={"Arch Plan-1"}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    {/* <CardContent className="p-3">
                                      <div className="flex items-center">
                                        <FileImage className="h-4 w-4 mr-2 text-gray-500" />
                                        <p className="text-sm font-medium">{drawing.title}</p>
                                      </div>
                                    </CardContent> */}
                                  </Card>
                                ))
                              }
                            </div>
                          </TabsContent>
                          
                          {/* <TabsContent value="documents">
                            <div className="space-y-2">
                              {property.architecturalDrawings
                                .filter(drawing => drawing.type === "document")
                                .map(drawing => (
                                  <Card key={drawing.id}>
                                    <CardContent className="p-3 flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                      <p className="text-sm font-medium">{drawing.title}</p>
                                      <Button
                                        className="ml-auto"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(drawing.url, '_blank')}
                                      >
                                        View
                                      </Button>
                                    </CardContent>
                                  </Card>
                                ))
                              }
                            </div>
                          </TabsContent> */}
                        </Tabs>
                      </div>
                    )}
                    

                    {/* Comments Section */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">Reviews & Comments</h2>
                      
                      {/* Display existing comments */}
                      <div className="space-y-4 mb-6">
                        {comments.map((comment) => (
                          <Card key={comment.id}>
                            <CardContent className="px-4 py-1">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-normal">{comment.name}</h4>
                                <span className="text-sm text-gray-500">{comment.dateCreated}</span>
                              </div>
                              <div className="flex mb-2">
                                {renderRating(comment.rating)}
                              </div>
                              <p className="text-gray-600">{comment.text}</p>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {comments.length === 0 && (
                          <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review!</p>
                        )}
                      </div>
                      
                      {/* Add new comment form */}
                      <Card>
                        <CardContent className="px-6">
                          <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                          <FormProvider {...commentForm}>
                            <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-4">
                                <div className="flex items-center mb-4">
                                <span className="mr-2 text-sm">Your Rating:</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} 
                                        type="button" 
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none cursor-pointer"
                                    >
                                        <Star 
                                        className={`h-6 w-6 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                                        />
                                    </button>
                                    ))}
                                </div>
                                </div>
                                
                                <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea 
                                    {...commentForm.register("comment")} 
                                    placeholder="Share your experience with this property..."
                                    className="min-h-[100px]"
                                    required
                                    />
                                </FormControl>
                                </FormItem>
                                
                                <Button type="submit" className="w-fit float-right bg-[#0253CC] hover:bg-[#1D4ED8] disabled:cursor-default disabled:bg-gray-200"
                                disabled={rating > 0 && isLoading}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                  Submit Review
                                </Button>
                            </form>
                          </FormProvider>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Request Tour Section */}
                    {/* <div className="bg-white h-[32rem] md:h-96 p-6 rounded-lg shadow-sm border mt-8">
                      <h2 className="text-xl font-semibold mb-4">Request a Tour</h2>
                      <FormProvider {...tourForm}>
                        <form onSubmit={tourForm.handleSubmit(onSubmitTourRequest)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...tourForm.register("name")} placeholder="Your name" required />
                            </FormControl>
                            </FormItem>
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...tourForm.register("email")} type="email" placeholder="Your email" required />
                            </FormControl>
                            </FormItem>
                            <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <FormControl>
                                <Input {...tourForm.register("date")} type="date" required />
                            </FormControl>
                            </FormItem>
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input {...tourForm.register("time")} placeholder="Enter Preferred time" />
                            </FormControl>
                            </FormItem>
                          </div>
                          <FormItem>
                              <FormLabel>Message (Optional)</FormLabel>
                              <FormControl>
                              <Input {...tourForm.register("message")} placeholder="Any special requests or questions?" />
                              </FormControl>
                          </FormItem>
                          
                          <Button type="submit" className="w-fit float-right bg-[#0253CC] hover:bg-[#1D4ED8] mb-4">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Tour
                          </Button>
                        </form>
                      </FormProvider>
                    </div> */}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Agency Details Card */}
                    {/* <Card>
                      <CardContent className="pt-6 text-sm md:text-base">
                        <div className="text-center mb-4">
                          <img 
                            src={property.agency.logo} 
                            alt={property.agency.name} 
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          />
                          <h3 className="font-semibold text-sm">{property.agency.name}</h3>
                          <p className="text-gray-600 text-sm">{property.agentName} - Listing Agent</p>
                        </div>
                        
                        <div className={`space-y-4 ${showAgencyDetails ? 'block' : 'hidden'}`}>
                          <div className="flex items-center justify-between border-t pt-3">
                            <span className="text-gray-600">Phone</span>
                            <a 
                              href={`tel:${property.agency.phone}`} 
                              className="flex items-center text-real-600 hover:underline"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              {property.agency.phone}
                            </a>
                          </div>
                          
                          <div className="flex items-center justify-between border-t pt-3">
                            <span className="text-gray-600">Email</span>
                            <a 
                              href={`mailto:${property.agency.email}`} 
                              className="flex items-center text-real-600 hover:underline"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              {property.agency.email}
                            </a>
                          </div>
                          
                          <div className="flex items-center justify-between border-t pt-3">
                            <span className="text-gray-600">WhatsApp</span>
                            <a 
                              href={`https://wa.me/${property.agency.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="flex items-center text-real-600 hover:underline"
                            >
                              {property.agency.whatsapp}
                            </a>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => setShowAgencyDetails(!showAgencyDetails)}
                        >
                          {showAgencyDetails ? "Hide Agency Details" : "View Agency Details"}
                        </Button>
                        
                        <div className="flex gap-4 mt-4">
                          <Button 
                            className="flex-1 bg-real-600 hover:bg-real-700" 
                            size="lg"
                            onClick={() => setShowContactModal(true)}
                          >
                            Contact Agent
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            size="lg"
                            onClick={() => setShowScheduleModal(true)}
                          >
                            Schedule Viewing
                          </Button>
                        </div>
                      </CardContent>
                    </Card> */}
                    
                    {/* Property Details */}
                    {/* <Card>
                      <CardContent className="py-1 text-sm md:text-base">
                        <h3 className="font-semibold text-lg mb-4">Property Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type</span>
                            <span>{property.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year Built</span>
                            <span>{property.yearBuilt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Parking</span>
                            <span>{property.parkingSpaces} spaces</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card> */}
                  </div>
                </div>
                
                {/* Similar Properties Section */}
                {/* <div className="mt-16">
                  <h2 className="text-2xl font-semibold mb-6">Similar Properties</h2>
                  <div className="relative overflow-hidden">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {property.similarProperties?.slice(0, 10).map((similarProperty : any) => (
                          <CarouselItem key={similarProperty.id} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full py-0">
                              <div className="relative h-48">
                                <img
                                  src={similarProperty.image ? similarProperty.image : "https://via.placeholder.com/150"}
                                  alt={similarProperty.title}
                                  className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-4 left-4 bg-[#0253CC]">{similarProperty.type}</Badge>
                                <Badge className="absolute top-4 right-4 bg-white text-[#102A43]">{similarProperty.price}</Badge>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{similarProperty.title}</h3>
                                <div className="flex items-center text-gray-600 mb-3">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{similarProperty.location}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 border-t pt-3">
                                  <div className="flex items-center">
                                    <Bed className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{similarProperty.beds} beds</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm">{similarProperty.baths} baths</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm">{similarProperty.sqft} sqft</span>
                                  </div>
                                </div>
                                <Button 
                                  className="w-full mt-4" 
                                  variant="outline"
                                  onClick={() => window.location.href = `/properties/${similarProperty.id}`}
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                      <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
                    </Carousel>
                  </div>
                </div> */}
              </div>
              
              <ContactAgentModal 
                isOpen={showContactModal} 
                onClose={() => setShowContactModal(false)}
                propertyTitle={"property.agentName"}
              />
              
              <ScheduleViewingModal 
                isOpen={showScheduleModal} 
                onClose={() => setShowScheduleModal(false)}
                propertyTitle={"property.title"}
              />
              <ErrorDialog
                open={errorMsg.flag}
                onOpenChange={() => setErrorObj({...errorMsg, msg : '', flag :false})}
                description={errorMsg.msg}
              />
            </div>
          )
      }
      <Footer/>
    </React.Fragment>
  );
};

export default PropertyDetails;
