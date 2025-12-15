'use client';
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Zap,
  Bed,
  Bath,
  Square,
  MapPin,
  Eye,
  Calendar,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  XCircle,
  Play,
  CheckCircle,
  MessageCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { convertDateCreatedToGetNumberOfDays, formatPrice } from "../../../../../utils/helpers";
import { axiosInstance } from "@/lib/axios-interceptor";
import { PropertyInterface } from "../../../../../utils/interfaces";
import { LoaderViewProperty } from "@/components/shared/loader-cards";
import { Input } from "@/components/ui/input";

const AgentPropertyDetailPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const router = useRouter();
  
  const [propertyData, setProperty] = useState<PropertyInterface>({} as PropertyInterface);
  const [isBoosted, setIsBoosted] = useState(propertyData?.isBoosted);
  const [isTaken, setIsTaken] = useState(propertyData?.isPropertyTaken);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Pending": "secondary",
      "Sold": "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const handleMarkAsTaken = async() => {

    await axiosInstance.delete(`/property/archive-property/${id}`)
    .then((response) => {
      if(response?.data?.success){
        setIsTaken(true);
        toast.success("Property Marked as Taken",
        {description: "Property has been taken off the market."});
      }
    }).catch((err) => {
      setIsTaken(false);
      console.log({err});
      toast.error("Action Failed", {description: "Unable to update property status. Please try again."});
    });
  };

  const handleShare = (platform: string, url = window.location.href) => {

    const text = `Check out this property: ${propertyData.title}`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "whatsapp" : 
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link Copied!", {description: "Property link copied to clipboard." });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  useEffect(() => {
    const boostPaymentReference = localStorage.getItem("boost_payment_reference");
    if(boostPaymentReference){
      // verify payment status from backend
      axiosInstance.get(`/payment/boost/verify/${boostPaymentReference}`)
      .then((response) => {
        console.log({response});
        if(response?.data?.success){
          toast.success("Property Boosted!",{description : "Your property will now appear higher in search results."});
          localStorage.removeItem("boost_payment_reference");
          setIsBoosted(true);
        }
      }).catch((err) => {
        console.log({err});
      });
    }
  },[]);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance.get(`/property/customer-listings/detail/${id}`)
    .then((response) => {
      setProperty(response?.data?.data?.property);
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      console.log({err});
    });
  },[isTaken, isBoosted]);

  if(isLoading) {
    return <LoaderViewProperty/>
  }

  if(!propertyData) {
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <Button onClick={() => router.push("/agent-dashboard/properties")}>Back to Listings</Button>
        </div>
      </main>
    </div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/agent-dashboard/properties')} 
          className="mb-6">

          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        {/* Taken Status Banner */}
        {propertyData?.isPropertyTaken && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive font-medium">This property has been taken off the market</span>
          </div>
        )}
        {/* Title */}
        <div className="flex items-start justify-between mb-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground capitalize">{propertyData?.title}</h1>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{propertyData?.address}</span>
                </div>
                <div className="flex flex-row items-center gap-4 mt-4">
                  {getStatusBadge(!propertyData?.isPropertyTaken ? "Active" : "Taken")}
                  {propertyData?.isBoosted && (
                    <Badge className="bg-yellow-500 text-white-900">
                      <Zap className="h-3 w-3 mr-1" />
                      Boosted
                    </Badge>
                  )}

                </div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-primary">{formatPrice(propertyData?.price)}</div>
                <Badge variant="outline" className="mt-1 capitalize">{propertyData?.propertyCategory?.toLowerCase()}</Badge>
            </div>
        </div>
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Slider */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {propertyData?.photoUrls?.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative">
                        <img
                          src={image}
                          alt={`${propertyData?.title} - Photo ${index + 1}`}
                          className="w-full h-[400px] md:h-[500px] object-cover rounded-xl"
                        />
                        {index === 0 && (
                          <div className="absolute top-4 left-4 flex gap-2">
                            {propertyData?.isNewBuilding &&(
                              <Badge className="bg-green-500 text-white">
                                New
                              </Badge>
                            )}
                            <Badge className="bg-blue-500 text-white">
                                FOR&nbsp;{propertyData?.upFor}
                              </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          {index + 1} / {propertyData?.photoUrls?.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/*  Description */}
            <div className="space-y-4">
              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed capitalize">{propertyData.description}</p>
              </div>
            </div>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{propertyData?.noOfBedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{propertyData?.noOfToilets}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms
                        <br/>/&nbsp;Toilets
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Square className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{propertyData?.sizeInSquareFeet?.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Sq&nbsp;Ft</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="">
                    <span className="text-muted-foreground">Latitude:</span>
                    <p className="font-medium">{propertyData?.geoCoordinates?.latitude}</p>
                  </div>
                  <div className="">
                    <span className="text-muted-foreground">Longitude:</span>
                    <p className="font-medium">{propertyData?.geoCoordinates?.longitude}</p>
                  </div>
                  <div className="">
                    <span className="text-muted-foreground">Listed:</span>
                    <p className="font-medium">{new Date(propertyData?.dateCreated).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="px-4">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {propertyData?.hasCctv &&
                    <Badge variant="secondary" className="px-3 py-1">
                      CCTV
                    </Badge>
                  }
                  {propertyData?.hasGym &&
                    <Badge variant="secondary" className="px-3 py-1">
                      Gym
                    </Badge>
                  }

                  {propertyData?.hasKidsPlayArea &&
                    <Badge variant="secondary" className="px-3 py-1">
                      Kids&nbsp;Area
                    </Badge>
                  }
                  
                  {propertyData?.hasCarParking &&
                    <Badge variant="secondary" className="px-3 py-1">
                      Car&nbp;Parking
                    </Badge>
                  }

                  {propertyData?.hasWifi &&
                    <Badge variant="secondary" className="px-3 py-1">
                      Has&nbsp;WiFi
                    </Badge>
                  }
                </div>
              </CardContent>
            </Card>

            {/* Video Slider */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Property Video</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare("facebook", propertyData?.videoUrl)}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter", propertyData?.videoUrl)}>
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("whatsapp", propertyData?.videoUrl)}>
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      whatsapp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("copy",  propertyData?.videoUrl)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <video
                controls
                autoPlay
                muted
                loop
                playsInline
                src={propertyData?.videoUrl}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                poster={propertyData?.photoUrls?.[0]}
              />

            {/* architectural plans */}
            {propertyData?.architecturalPlanUrls &&
              <Card>
                <CardContent className="py-2 px-4">
                  <h2 className="text-xl font-semibold">Property Architecture</h2>

                  <Carousel className="w-full">
                    <CarouselContent>
                      {propertyData?.architecturalPlanUrls?.map((arch, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="relative group cursor-pointer mt-4">
                            <img
                              src={arch}
                              alt={"Architectural Plan " + (index + 1)}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </CardContent>
              </Card>
          }
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Property Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <span className="text-muted-foreground">Total View(s)</span>
                    </div>
                    <span className="font-bold text-lg">{0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span className="text-muted-foreground">Days on&nbsp;Market</span>
                    </div>
                    <span className="font-bold text-lg">&nbsp;{convertDateCreatedToGetNumberOfDays(propertyData?.dateCreated)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-2">Actions</h3>
                
                {/* Boost Button */}
                {!propertyData?.isBoosted ? (
                  <Button 
                    onClick={() => setIsBoosted(true)} 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                    disabled={isBoosted}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Boost Property
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Already Boosted
                  </Button>
                )}

                {/* Mark as Taken Button */}
                <Button 
                  onClick={() => setPrompt(true)} 
                  variant={propertyData?.isPropertyTaken ? "default" : "destructive"}
                  className="w-full"
                  disabled={propertyData?.isPropertyTaken}
                >
                  {/* {propertyData?.isPropertyTaken ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Restore Property
                    </>
                  ) : () }*/}
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Taken
                  </>
                  
                </Button>

                {/* Share Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Property
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter")}>
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      Whatsapp
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => handleShare("copy")}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Property ID */}
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">
                  Property ID: <span className="font-medium">#{1}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Confirm Mark as Taken Prompt */}
        {prompt && <ConfirmMarkAsTakenPrompt 
          isOpen={prompt} 
          onClose={() => setPrompt(false)} 
          onConfirm={handleMarkAsTaken} 
        />}
        {/* Boost Property Prompt */}
        {isBoosted && <BoostPropertyPrompt 
          isOpen={isBoosted} 
          onClose={() => setIsBoosted(false)} 
          id={propertyData?.id}
          setBoost={() => setIsBoosted(true)}
        />}
      </div>
    </div>
  );
};

export default AgentPropertyDetailPage;

const ConfirmMarkAsTakenPrompt = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null; 
  return(
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
        <p className="mb-6">Are you sure you want to mark this property as taken? This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            onClose();
          }}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

const BoostPropertyPrompt = ({ isOpen, onClose, id,setBoost }: { isOpen: boolean; onClose: () => void; id:string, setBoost : () => void}) => {
  const [weeks, setNoOfWeeksState] = useState(1);

  if (!isOpen) return null; 

  const onChangeWeeks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weeks = parseInt(e.target.value); 
    if(weeks < 1){
      toast.error("Invalid Input", {description: "Number of weeks must be at least 1."});
    }
    setNoOfWeeksState(weeks);
  };

   const handleBoost = async () => {
     await axiosInstance.post(`/payment/boost/purchase`,{
      propertyId: id,
      weeks 
     })
    .then((response) => {
      if(response?.data?.success){
        localStorage.setItem("boost_payment_reference", response?.data?.paymentReference);
        // redirect to payment gateway 
        onClose();
        window.location.href = response?.data?.authorizationUrl;
      }
    }).catch((err) => {
      onClose();
      console.log({err});
      toast.error("Action Failed", {description: "Unable to complete the Boosting Process. Please try again."});
    });
  };


  return( 
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Boost Property</h2>  
        <p className="mb-6">Boosting your property will increase its visibility in search results. Do you want to proceed?</p>
        {/* add input field for number of weeks the agent can afford to boost property nothing less than 1 week should be added  */}
        <Input type="number" min={1} placeholder="Enter number of weeks to boost" className="mb-6"
        onChange={onChangeWeeks}/>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={() => {
            handleBoost();
          }}>
          Boost</Button>
        </div>
      </div>
    </div>
  );
}