"use client";
import {
  Bed,
  Heart,
  MapPin,
  Star,
  StarHalf,
  Wifi,
  Dumbbell,
  WashingMachine,
  MessageCircle,
  Eye,
  Car,
  CheckCircle2,
  Baby,
  MinusCircle,
  PawPrint,
  Building2,
  Cctv,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ContactAgentModal from "./Dialogs/Contact-agent";
import ScheduleViewingModal from "./Dialogs/schedule-viewing";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { Badge } from "@/components/ui/badge";
import {
  CommentInterface,
  PropertyInterface,
  ViewPropertyInterface,
} from "../../../../utils/interfaces";
import { formatPrice, pickUserId } from "../../../../utils/helpers";
import { LoaderViewProperty } from "@/components/shared/loader-cards";
import { ErrorDialog } from "@/components/shared/error-dialog";
import { axiosInstance } from "@/lib/axios-interceptor";
import AgentAvailabilityPicker from "@/components/shared/agent-availability-component";
import ReportModal from "./Dialogs/report-property";
import dynamic from "next/dynamic";
import AgencySnippetCard from "@/components/shared/agency-snippet-card";
// just importing the propertyMap component led to window not defined issues because it was running on the server b4 the window was up
// using use client specified client component not server but importing dynamically and disabling ssr makes the component wait until window is up b4 running
// voila problem solved

const PropertyMap = dynamic(() => import("./property-map"), { ssr: false });

// type TourFormData = {
//   name: string;
//   email: string;
//   time: string;
//   date: string;
//   message: string;
// };

const PropertyDetails = () => {
  const searchParams = useSearchParams();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [propertyData, setProperty] = useState<ViewPropertyInterface>(
    {} as ViewPropertyInterface
  );
  const [comments, setComments] = useState<CommentInterface[]>(
    [] as CommentInterface[]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorObj] = useState<{ msg: string; flag: boolean }>({
    msg: "",
    flag: false,
  });

  // Form for tour request
  // const tourForm = useForm<TourFormData>({
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     time: "",
  //     date: "",
  //     message: "",
  //   },
  // });

  // Form for comment submission
  const commentForm = useForm<{ comment: string; rating: number }>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  // const onSubmitTourRequest = (data: TourFormData) => {
  //   console.log("Tour request submitted:", data);
  //   toast.success("Tour request submitted successfully!");
  //   tourForm.reset();
  // };

  const onSubmitComment = (data: { comment: string; rating: number }) => {
    // if a user is not logged in and has not viewed the apartment, user cannot make a comment
    // if(!isUserLoggedIn() && !propertyData?.isViewed){
    //   toast.info("Only logged-in users who have viewed this apartment can leave comments.");
    //   return;
    // }
    setIsLoading(true);
    axiosInstance
      .post(`agent-property-viewing/rate-viewing`, {
        propertyViewingId: propertyData.property.id,
        rating,
        comment: data.comment,
      })
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Thank you for your review!");
        } else {
          setErrorObj({
            ...errorMsg,
            flag: true,
            msg: response?.data?.message,
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorObj({
          ...errorMsg,
          flag: true,
          msg: err?.response?.data?.message.includes(
            "Property viewing with this id not found"
          )
            ? "Only Confirmed viewers of this property can make a comment."
            : err?.response?.data?.message,
        });
        setIsLoading(false);
      });
    commentForm.reset();
    setRating(0);
  };

  const handleSaveProperty = async () => {
    setIsSaved(!isFavourite);

    const url = "/favourite-property";
    const propertyId = propertyData.property.id;
    //add to favorite logic here if user is logged in
    //if not redirect to login page with a prompt | toast
    //if property is already saved, remove from favorites
    try {
      if (!isFavourite) {
        const response = await axiosInstance.post(url, {
          propertyId,
        });
        if (response.data.success) {
          toast.error(response.data.message);
          setIsFavourite(true);
        }
        toast.success("Property saved to favorites!");
      } else {
        // remove from favorites
        const response = await axiosInstance.delete(url, {
          data: { propertyIds: [propertyId] },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setIsFavourite(false);
        }
        toast.info("Property removed from favorites");
      }
      return;
    } catch (error) {
      //console.log(error);
      toast.error(`${error}`);
    }

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
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 fill-amber-400 text-amber-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-5 w-5 fill-amber-400 text-amber-400"
        />
      );
    }

    return stars;
  };

  // const getInfoFromLocalStorage = () => {
  //   const encryptionKey = String(
  //     process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY
  //   );
  //   const result = getLocalStorageField("userInfo");
  //   return JSON.parse(decryptData(result, encryptionKey));
  // };

  useEffect(() => {
    const slug = searchParams.get("id");
    const userId = pickUserId();
    const fetchData = async () => {
      let url = `property/customer-listings/detail/${slug}`;
      if (userId) {
        url += `?userId=${userId}`;
      }

      try {
        const propertyResult = await axiosInstance.get(url);
        if (propertyResult.data.success) {
          const propertyObject = propertyResult.data.data;
          setProperty(propertyObject || ({} as ViewPropertyInterface));
          setIsFavourite(propertyObject.isFavourite);

          // get comments
          const commentsResult = await axiosInstance.get(
            `agent-property-viewing/user-ratings/${propertyObject?.property?.id}`
          );
          if (commentsResult.data.success) {
            setComments(commentsResult.data.data);
          }
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching properties:", error);
      }
    };
    if (slug || userId) fetchData();
  }, []);

  // useEffect(() => {
  //   // on refresh this component reloads and triggers this api call to verify user payment
  //   const viewingId = getLocalStorageFieldRaw("viewingId") as string;
  //   const paymentReference = getLocalStorageFieldRaw("payRef") as string;

  //   const VerifyVirtualPayment = async () => {
  //     try {
  //       const paymentConfirmationResponse = await axiosInstance.post(`/agent-property-viewing/virtual/confirm`,{
  //         viewingId,
  //         paymentReference
  //       });
  //       console.log({paymentConfirmationResponse});
  //       if(paymentConfirmationResponse?.data?.success){
  //         toast.success(paymentConfirmationResponse?.data?.message);
  //       }
  //     } catch (error : any) {
  //       console.log({error});
  //       toast.error("Payment Did not go through",{description : error?.response?.data?.message});
  //     }finally{
  //       localStorage.removeItem("viewingId");
  //       localStorage.removeItem("payRef");
  //     }
  //   }
  //   if(viewingId && paymentReference){
  //     VerifyVirtualPayment();
  //   }
  // },[]);

  const ratingConstant = propertyData?.property?.bluepoddRating
    ? propertyData.property.bluepoddRating
    : 0;

  return (
    <React.Fragment>
      <Navbar />
      {isLoading ? (
        <LoaderViewProperty />
      ) : (
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8 mt-16">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-navy-900 capitalize">
                  {propertyData.property?.title || ""}
                </h1>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {renderRating(ratingConstant)}
                    <span className="ml-2 text-gray-600">
                      ({ratingConstant})
                    </span>
                  </div>
                  <ReportModal
                    propertyId={propertyData?.property?.id as string}
                    agencyId={propertyData?.property?.agencyId as string}
                  />
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <p className="text-base capitalize">
                  {new String(
                    propertyData?.property?.address
                      ? propertyData.property.address
                      : ""
                  ).toLowerCase()}
                </p>
              </div>
              <Tabs defaultValue="images" className="space-y-6">
                <TabsList className="grid w-full lg:w-[400px] grid-cols-2">
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>
                <TabsContent value="images" className="space-y-6">
                  {/* Property Image Slider */}
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {propertyData.property?.propertyImages?.map(
                          (image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative">
                                <img
                                  src={image?.image?.url}
                                  alt={`${
                                    propertyData.property.title
                                  } - Image ${index + 1}`}
                                  className="w-full h-[350px] sm:h-[400px] md:h-[500px] object-cover rounded-lg"
                                />
                                {index === 0 && (
                                  <>
                                    <Badge className="absolute top-4 left-4 bg-[#0253CC] px-4 py-2 rounded-full capitalize">
                                      {propertyData.property.propertyType?.name}
                                    </Badge>
                                    {propertyData.property.isNewBuilding && (
                                      <Badge className="absolute p-2 rounded-full top-4 left-40 bg-green-500 hover:bg-green-600">
                                        New
                                      </Badge>
                                    )}
                                    <Badge className="absolute top-4 right-4 bg-white text-[#102A43] p-2 rounded-full">
                                      {formatPrice(
                                        propertyData.property.price || 0
                                      )}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </CarouselItem>
                          )
                        )}
                      </CarouselContent>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </Carousel>

                    {/* Save Property Button */}
                    <Button
                      variant={isFavourite ? "default" : "outline"}
                      size="icon"
                      className={`absolute bottom-4 right-4 rounded-full z-10 ${
                        isFavourite
                          ? "bg-real-600 hover:bg-real-700"
                          : "bg-white hover:bg-gray-100"
                      }`}
                      onClick={handleSaveProperty}
                      title={
                        isFavourite
                          ? "Remove from bookmarks"
                          : "Bookmark property"
                      }
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavourite
                            ? "fill-white text-white"
                            : "text-real-600"
                        }`}
                      />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="map" className="space-y-6">
                  <PropertyMap
                    latitude={
                      propertyData?.property?.geoCoordinates?.latitude as number
                    }
                    longitude={
                      propertyData?.property?.geoCoordinates
                        ?.longitude as number
                    }
                    title={propertyData?.property?.title}
                    address={propertyData?.property?.address}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Main Property Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-5 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">
                        {propertyData?.property?.noOfBedrooms}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {propertyData?.property?.noOfToilets}
                    </div>
                    <p className="text-sm text-gray-600">Bath/Toilet(s)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {propertyData?.property?.sizeInSquareFeet}
                    </div>
                    <p className="text-sm text-gray-600">Square Feet</p>
                  </div>
                  {propertyData?.property?.additionalCosts &&
                  propertyData.property.additionalCosts.length > 0
                    ? propertyData.property.additionalCosts.map(
                        (cost: { amount: number; title: string }, index) => (
                          <div className="text-center" key={index}>
                            <div className="text-lg font-semibold">
                              {formatPrice(cost.amount || 0)}
                            </div>
                            <p className="text-sm text-gray-600">
                              {cost.title}
                            </p>
                          </div>
                        )
                      )
                    : ""}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-3">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base capitalize">
                    {propertyData?.property?.description}
                  </p>
                </div>

                {/* Amenities Section */}
                <div className="max-w-12xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDE — Combined Box */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 space-y-10">
                      {/* ===== PROPERTY AMENITIES ===== */}
                      <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-5">
                          Property Amenities
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {/* WiFi */}
                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasWifi
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            } text-sm`}
                          >
                            <Wifi className="w-5 h-5" />
                            <p>Wi-Fi</p>
                            {propertyData?.property?.hasWifi ? (
                              <CheckCircle2 className="w-4 h-4 opacity-70" />
                            ) : (
                              <MinusCircle className="w-4 h-4" />
                            )}
                          </div>

                          {/* Gym */}
                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasGym
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            } text-sm`}
                          >
                            <Dumbbell className="w-5 h-5" />
                            <p>Gym</p>
                            {propertyData?.property?.hasGym ? (
                              <CheckCircle2 className="w-4 h-4 opacity-70" />
                            ) : (
                              <MinusCircle className="w-4 h-4" />
                            )}
                          </div>

                          {/* Laundry */}
                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasLaundry
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            } text-sm`}
                          >
                            <WashingMachine className="w-5 h-5" />
                            <p>Laundry</p>
                            {propertyData?.property?.hasLaundry ? (
                              <CheckCircle2 className="w-4 h-4 opacity-70" />
                            ) : (
                              <MinusCircle className="w-4 h-4" />
                            )}
                          </div>

                          {/* CCTV */}
                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasCctv
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            } text-sm`}
                          >
                            <Cctv className="w-5 h-5" />
                            <p>CCTV</p>
                            {propertyData?.property?.hasCctv ? (
                              <CheckCircle2 className="w-4 h-4 opacity-70" />
                            ) : (
                              <MinusCircle className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100"></div>

                      {/* ===== PROPERTY FEATURES ===== */}
                      {/* Features */}
                      <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-5">
                          Property Features
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasCarParking
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 bg-gray-200"
                            } text-sm`}
                          >
                            <span className="">
                              <Car className="w-5 h-5" />
                            </span>
                            <p>{"Car Parking"}</p>
                            {propertyData?.property?.hasCarParking ? (
                              <CheckCircle2 className="w-4 h-4 mt-1 opacity-70" />
                            ) : (
                              <MinusCircle className="w-4 h-4 mt-1" />
                            )}
                          </div>

                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.hasKidsPlayArea
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 bg-gray-200"
                            } text-sm`}
                          >
                            <span className="">
                              <Baby className="w-5 h-5" />
                            </span>
                            <p>{"Kids Area"}</p>
                            {propertyData?.property?.hasKidsPlayArea ? (
                              <CheckCircle2 className="w-4 h-4 mt-1" />
                            ) : (
                              <MinusCircle className="w-4 h-4 mt-1" />
                            )}
                          </div>

                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.isPetFriendly
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 bg-gray-200"
                            } text-sm`}
                          >
                            <span className="">
                              <PawPrint className="w-5 h-5" />
                            </span>
                            <p>{"Pet Friendly"}</p>
                            {propertyData?.property?.isPetFriendly ? (
                              <CheckCircle2 className="w-4 h-4 mt-1" />
                            ) : (
                              <MinusCircle className="w-4 h-4 mt-1" />
                            )}
                          </div>

                          <div
                            className={`flex justify-between items-center gap-2 p-3 rounded-lg shadow-sm ${
                              propertyData?.property?.isNewBuilding
                                ? "bg-green-50 text-green-700"
                                : "text-gray-600 bg-gray-200"
                            } text-sm`}
                          >
                            <span className="">
                              <Building2 className="w-5 h-5" />
                            </span>
                            <p>{"New Building"}</p>
                            {propertyData?.property?.isNewBuilding ? (
                              <CheckCircle2 className="w-4 h-4 mt-1" />
                            ) : (
                              <MinusCircle className="w-4 h-4 mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE — Agent Card (unchanged) */}

                    <div className="lg:col-span-1">
                      {propertyData.property.agency && (
                        <AgencySnippetCard
                          agency={propertyData.property.agency}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* {isUserLoggedIn() && ( */}
                <AgentAvailabilityPicker
                  propertyId={propertyData?.property?.id as string}
                />
                {/* )} */}
                {/* Video tag section*/}
                {propertyData?.property?.video && (
                  <div className="my-4">
                    <p className="py-2 font-medium">Watch Property Video</p>
                    <video width="100%" height="360" controls>
                      <source
                        src={propertyData?.property?.video?.url}
                        type={propertyData?.property?.video?.mimeType}
                      />
                    </video>
                  </div>
                )}

                {/* Architectural Drawings Section */}
                {propertyData?.property?.propertyArchPlans &&
                  propertyData?.property?.propertyArchPlans?.length > 0 && (
                    <div className="text-sm md:text-base">
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">
                        Architectural Drawings
                      </h2>
                      <Tabs defaultValue="images">
                        <TabsList className="mb-4">
                          <TabsTrigger value="images">Floor Plans</TabsTrigger>
                          {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="images">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {propertyData?.property?.propertyArchPlans?.map(
                              (drawing, i: number) => (
                                <Card
                                  key={drawing?.id}
                                  className="overflow-hidden"
                                >
                                  <div className="h-48 overflow-hidden">
                                    <img
                                      src={drawing?.architecturalPlan?.url}
                                      alt={`Arch Plan-${i}`}
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
                              )
                            )}
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
                  {comments?.length > 0 ? (
                    <>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3">
                        Reviews & Comments
                      </h2>

                      {/* Display existing comments */}
                      <div className="space-y-4 mb-6">
                        {comments.map((comment) => (
                          <Card key={comment.id}>
                            <CardContent className="px-4 py-1">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-normal">{comment.name}</h4>
                                <span className="text-sm text-gray-500">
                                  {comment.dateCreated}
                                </span>
                              </div>
                              <div className="flex mb-2">
                                {renderRating(comment.rating)}
                              </div>
                              <p className="text-gray-600">{comment.text}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic my-4">
                      No reviews yet. Be the first to leave a review!
                    </p>
                  )}

                  {/* Add new comment form */}
                  {/* {propertyData?.isViewed &&  */}
                  <Card
                    className={`mb-6 ${
                      !propertyData?.isViewed ? "opacity-50 bg-gray-100" : ""
                    }`}
                  >
                    <CardContent className="px-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Leave a Review
                      </h3>
                      <FormProvider {...commentForm}>
                        <form
                          onSubmit={commentForm.handleSubmit(onSubmitComment)}
                          className="space-y-4"
                        >
                          <div className="flex items-center mb-4">
                            <span className="mr-2 text-sm">Your Rating:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none cursor-pointer disabled:cursor-default"
                                  disabled={
                                    propertyData?.isViewed ? false : true
                                  }
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      rating >= star
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                    }`}
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
                                className="min-h-[100px] disabled:cursor-not-allowed disabled:bg-gray-100"
                                required
                                disabled={propertyData?.isViewed ? false : true}
                              />
                            </FormControl>
                          </FormItem>

                          <Button
                            type="submit"
                            className="w-fit float-right bg-[#0253CC] hover:bg-[#1D4ED8] disabled:cursor-default disabled:bg-gray-200"
                            disabled={
                              (rating > 0 && isLoading) ||
                              (!propertyData?.isViewed ? true : false)
                            }
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Submit Review
                          </Button>
                        </form>
                      </FormProvider>
                    </CardContent>
                  </Card>
                  {/* } */}
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
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">
                Similar Properties
              </h2>
              <div className="relative overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {propertyData.similarProperties
                      ?.slice(0, 10)
                      .map((similarProperty: Partial<PropertyInterface>) => (
                        <CarouselItem
                          key={similarProperty.id}
                          className="md:basis-1/1 lg:basis-1/2"
                        >
                          <Card className="overflow-hidden flex items-center gap-2 flex-row hover:shadow-lg transition-shadow h-full py-0">
                            <div className="w-1/2 relative h-56">
                              <img
                                src={
                                  similarProperty.propertyImages
                                    ? similarProperty.propertyImages[0]?.image
                                        ?.url
                                    : "https://via.placeholder.com/150"
                                }
                                alt={similarProperty?.title}
                                className="w-full h-full object-cover"
                              />
                              <Badge className="absolute top-4 right-4 bg-white text-[#102A43] p-2 rounded-full">
                                {formatPrice(
                                  similarProperty?.price
                                    ? similarProperty.price
                                    : 0
                                )}
                              </Badge>
                              <Badge
                                className={`${
                                  similarProperty?.upFor?.toUpperCase() ===
                                  "RENT"
                                    ? "bg-[#0253CC]"
                                    : "bg-green-800"
                                } absolute top-4 left-4 capitalize px-4 py-2 font-normal rounded-full`}
                              >
                                {new String(
                                  similarProperty?.upFor
                                ).toLowerCase()}
                              </Badge>
                              <Badge
                                className="absolute bottom-4 right-4 bg-white text-[#102A43] cursor-pointer h-8 w-8"
                                onClick={() =>
                                  router.replace(
                                    `/properties/view/?id=${similarProperty.id}`
                                  )
                                }
                              >
                                <Eye className="w-20 h-20" />
                              </Badge>
                            </div>
                            <CardContent className="w-1/2 p-4">
                              <h3 className="text-lg font-semibold mb-2 capitalize">
                                {similarProperty?.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-3">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm capitalize">
                                  {similarProperty?.address}
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-600 border-t pt-3">
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  <span className="text-sm">
                                    {similarProperty?.noOfBedrooms} beds
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm">
                                    {similarProperty?.noOfToilets} baths
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm">
                                    {similarProperty?.sizeInSquareFeet} sqft
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                  <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
                </Carousel>
              </div>
            </div>
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
            onOpenChange={() =>
              setErrorObj({ ...errorMsg, msg: "", flag: false })
            }
            description={errorMsg.msg}
          />
        </div>
      )}
      <Footer />
    </React.Fragment>
  );
};

export default PropertyDetails;
