'use client';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Home, Image, Info } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios-interceptor";
import { LoaderProcessor } from "@/components/shared/loader-cards";
import axios from "axios";
import { CountryStatesInterface, PropertyTypesInterface } from "../../../../../../utils/interfaces";
import { getLocalStorageFieldRaw } from "../../../../../../utils/helpers";

const additionalCostSchema = z.object({
  title: z.string().optional().or(z.literal("")), //.min(1,""),
  price: z.number().optional().or(z.literal(0)) //.min(1,'0')
});

const propertySchema = z.object({
  propertyTypeId: z.string().min(1, "Property type is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  address: z.string().min(5, "Address is required"),
  upFor: z.enum(["SALE", "RENT"]),
  propertyCategory: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  photoIds: z.array(z.string()).min(1, "At least one photo is required"),
  price: z.string().regex(/^\d+$/, "Price must contain only digits").min(5, "Price must be at least 5 digits"), // z.number().min(0, "Price must be positive"),
  additionalCosts: z.array(additionalCostSchema),
  paymentCoverageDuration: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]),
  agencyId: z.string().min(1, "Agency ID is required"),
  stateId: z.string().min(1, "State is required"),
  sizeInSquareFeet:z.string().regex(/^\d+$/, "Square feet must contain only digits").min(1, "Square feet is required"),
  geoCoordinates: z.object({
    latitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Latitude must be a valid decimal number"
  ).refine(val => {
    const num = Number(val)
    return num >= -90 && num <= 90
  }, {
    message: "Latitude must be between -90 and 90",
  }),
    longitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Longitude must be a valid decimal number"
  ).refine(val => {
    const num = Number(val)
    return num >= -180 && num <= 180
  }, {
    message: "Longitude must be between -180 and 180",
  }),//z.number().min(-180).max(180),
  }),
  averageBroadbandSpeedInMegabytes: z.string().regex(/^\d+$/, "Average broadband speed must contain only digits").min(2, "Average broadband speed is required"),
  architecturalPlanIds: z.array(z.string()).optional().or(z.literal("")),
  noOfBedrooms: z.string().regex(/^\d+$/, "Number of Bedrooms must contain only digits").min(1, "Number of Bedrooms is required"), //z.number().min(1),
  noOfToilets:z.string().regex(/^\d+$/, "Number of Toilets must contain only digits").min(1, "Number of Toilets is required"), //z.number().min(1),
  noOfKitchens: z.string().regex(/^\d+$/, "Number of Kitchens must contain only digits").min(1, "Number of Kitchens is required"), //z.number().min(1),
  threeDimensionalModelUrl: z.string().url().optional().or(z.literal("")),
  hasLaundry: z.boolean(),
  hasWifi: z.boolean(),
  hasCarParking: z.boolean(),
  hasKidsPlayArea: z.boolean(),
  hasCctv: z.boolean(),
  hasGym: z.boolean(),
  isNewBuilding: z.boolean(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PropertyListingDialog({
  open,
  onOpenChange,
}: PropertyListingDialogProps) {
    const [activeTab, setActiveTab] = useState("basic");
    const [images, setImages] = useState<File[]>([]);
    //const [videos, setVideos] = useState<File[]>([]);
    const [architechturalImages, setArchitechturalImages] = useState<File[]>([]);
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);
    //const [videosUrl, setVideosUrl] = useState<string[]>([]);
    const [architechturalImagesUrl, setArchitechturalImagesUrl] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [propertTypes, setPropertyTypes] = useState<PropertyTypesInterface[]>([] as PropertyTypesInterface[]);
    const [countryStates, setCountryStates] =  useState<CountryStatesInterface[]>([]);
  
    const form = useForm<PropertyFormData, any, PropertyFormData>({
      resolver: zodResolver(propertySchema),
      mode : "onChange",
      defaultValues: {
        propertyTypeId: "",
        title: "",
        address: "",
        upFor: "SALE",
        propertyCategory: "RESIDENTIAL",
        description: "",
        photoIds: [],
        price: "",
        additionalCosts: [{title: "Agency fee", price: 1000}],
        paymentCoverageDuration: "YEARLY",
        agencyId: getLocalStorageFieldRaw('agentId') as string,
        stateId: "",
        sizeInSquareFeet: "",
        geoCoordinates: {
          latitude: "",
          longitude: "",
        },
        averageBroadbandSpeedInMegabytes: "",
        architecturalPlanIds: [],
        noOfBedrooms: "",
        noOfToilets: "",
        noOfKitchens: "",
        threeDimensionalModelUrl: "",
        hasLaundry: false,
        hasWifi: false,
        hasCarParking: false,
        hasKidsPlayArea: false,
        hasCctv: false,
        hasGym: false,
        isNewBuilding: false,
      },
    });

    const handleFileUpload = (files: FileList | null, type: 'image' | 'video' | 'architecture') => {
      if (!files) return;
      
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        if (type === 'image') {
          return file.type.startsWith('image/');
        } else if( type === 'architecture') {
            return file.type.startsWith('image/');
        }else {
          return file.type.startsWith('video/');
        }
      });
  
      if (type === 'image') {
        setImages(prev => [...prev, ...validFiles]);
      } else if (type === 'architecture') {
        setArchitechturalImages(prev => [...prev, ...validFiles]);
      }
      else{
        //setVideos(validFiles);
      }
    };
  
    const removeFile = (index: number, type: 'image' | 'video' | 'architecture') => {
      if (type === 'image') {
        setImages(prev => prev.filter((_, i) => i !== index));
      }else if( type === 'architecture') {
        setArchitechturalImages(prev => prev.filter((_, i) => i !== index));
      }else {
        // setVideos(prev => prev.filter((_, i) => i !== index));
      }
    };
    const newUploadFiles = (array : any, type : 'image' | 'video'|'architecture') => {

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}upload-files`, {
        files : array
      }, {headers : {
        'Content-Type' : 'multipart/form-data'
      }}).then(res => {
        switch(type){
          case 'image' : 
            setImagesUrl(res.data?.data);
            form.setValue('photoIds', res.data?.data?.map((item : any) => item.id), {
              shouldValidate: true,
              shouldDirty : true
            });
            
          break;
          // case 'video' : 
          //   setVideosUrl(res.data?.data);
          //   //form.setValue('videoId', res.data?.data?.map((item : any) => item.id));
          // break;
          case 'architecture' : 
            setArchitechturalImagesUrl(res.data?.data);
            form.setValue('architecturalPlanIds',res.data?.data?.map((item : any) => item.id));
          break;
          default : 
            console.log('');
          break;
        }

      }).catch(err => {
        toast.error(err?.response?.data?.message);
      });
    }
    const onSubmit = (data: PropertyFormData) => {
      setIsLoading(true);
      // agency id should be added automatically from agents information
      const newData = {
        ...data,
        price : parseInt(data.price),
        sizeInSquareFeet : parseInt(data.sizeInSquareFeet),
        averageBroadbandSpeedInMegabytes : parseInt(data.averageBroadbandSpeedInMegabytes),
        noOfBedrooms : parseInt(data.noOfBedrooms),
        noOfKitchens : parseInt(data.noOfKitchens),
        noOfToilets : parseInt(data.noOfToilets),
        geoCoordinates : {
          latitude : parseFloat(data.geoCoordinates.latitude),
          longitude : parseFloat(data.geoCoordinates.longitude)
        },
        videoId:null
        
      };
      try {
        axiosInstance.post("/property",{
          ...newData
        })
        .then((response) => {
          toast.success(response?.data?.message);
          onOpenChange(false);
          setIsLoading(false);
          form.reset();
        })
        .catch((error : any) => {
          toast.error(error?.response?.data?.message);
          setIsLoading(false);
        });
      } catch (error) {
          
      }finally{
        // onOpenChange(false);
        // setIsLoading(false);
        // form.reset();
      }

    };

    useEffect(() => {
      // get property Types
      axiosInstance.get('property-type')
      .then(res => {
        setPropertyTypes(res.data.data);
      }).catch(err => {
        console.error({err});
      });

      // get country 0b7c1c4d-65a5-484d-9b03-8c6b36d09634
      axiosInstance.get('country/states/all?countryId=0b7c1c4d-65a5-484d-9b03-8c6b36d09634')
      .then(res => {
        setCountryStates(res?.data?.data);
      }).catch(err => {
        console.error({err});
      });
    },[]);

    useEffect(() => {
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(file => formData.append('files[]', file));
        newUploadFiles(images, 'image');
      }
    },[images]);

  //   useEffect(() => {
  //     if (videos) {
  //       const formData = new FormData();
  //       videos.forEach(file => formData.append('files[]', file));
  //       newUploadFiles(videos, 'video');
  //     }
  // },[videos]);

  useEffect(() => {
    if (architechturalImages.length > 0) {
      const formData = new FormData();
      architechturalImages.forEach(file => formData.append('files[]', file));
      newUploadFiles(architechturalImages, 'architecture');
    }
  },[architechturalImages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="
        w-[95vw]
        max-w-full
        sm:max-w-[95vw]
        md:max-w-5xl
        lg:max-w-6xl
        max-h-[90vh]
        overflow-y-auto
        bg-white
      ">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Create Property Listing
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to list your property
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="mx-6 grid w-auto grid-cols-4 gap-2">
                <TabsTrigger value="basic" className="gap-2">
                  <Info className="h-4 w-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-2">
                  <Home className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="amenities" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Amenities
                </TabsTrigger>
                <TabsTrigger value="media" className="gap-2">
                  <Image className="h-4 w-4" />
                  Media
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(90vh-280px)] px-6 py-4">
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input required placeholder="Modern 3BR Apartment..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyTypeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Property Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertTypes && propertTypes?.map((data : PropertyTypesInterface, i : number) => 
                                <SelectItem key={`index_${i}`} className="capitalize" value={data.id}>{data.name}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="upFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SALE">SALE</SelectItem>
                              <SelectItem value="RENT">RENT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street, City, State" {...field}  required/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryStates.map((data) => 
                                <SelectItem value={data.id} key={data.id} className="capitalize">{data.name}</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="500000"
                              required
                              {...field}
                             onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentCoverageDuration"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Payment Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} required>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                              <SelectItem value="YEARLY">Yearly</SelectItem>
                              <SelectItem value="ONE_TIME">Once</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the property..."
                              className="min-h-[100px]"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sizeInSquareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size (sq ft)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="E.g., 1500"
                              required
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="averageBroadbandSpeedInMegabytes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Broadband Speed (Mbps)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="E.g., 100"
                              required
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noOfBedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rooms</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Number of Rooms"
                              {...field}
                              required
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noOfToilets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Toilets</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Number of Toilets & Bathrooms"
                              required
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noOfKitchens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kitchens</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Number of Kitchens"
                              required
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2 space-y-4">
                      <h3 className="text-sm font-medium">Geo Coordinates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="geoCoordinates.latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  step="any"
                                  required
                                  placeholder="Enter latitude of building. E.g., 40.7128"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="geoCoordinates.longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  step="any"
                                  placeholder="Enter longitude of building. E.g., -74.0060"
                                  required
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Property Features</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hasWifi"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">WiFi</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasCarParking"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Car Parking
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasLaundry"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Laundry</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasGym"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Gym</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasCctv"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">CCTV</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasKidsPlayArea"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Kids Play Area
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isNewBuilding"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4 col-span-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              New Building
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-0">
                    {/* Images */}
                    <div className="mt-2">
                      <Label>Property Images</Label>
                      <FormDescription>
                        Upload Property Images (You can upload multiple images)
                      </FormDescription>
                      <Card className="mt-2 border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                        <CardContent className="p-6">
                          <FormField
                            control={form.control}
                            rules={{required : "Please Upload at least one Image"}}
                            name="photoIds"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="text-center">
                                    <Label htmlFor="images" className="cursor-pointer">
                                      <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                                    </Label>
                                    <Input
                                      id="images"
                                      type="file"
                                      multiple
                                      accept="image/png, image/jpeg, image/gif image/jpg"
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        handleFileUpload(files, 'image');
                                        //field.onChange(imagesUrl); // update form value manually
                                      }}
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 2MB each</p>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                        </CardContent>
                      </Card>
                    
                      {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                          {(images as File[]).map((file, index) => (
                              <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file as File)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6"
                                onClick={() => removeFile(index, 'image')}>
                                  <X className="h-3 w-3" />
                              </Button>
                              </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Videos */}
                    {/* <div>
                      <Label>Property Video</Label>
                      <FormDescription>
                        Upload Property Video
                      </FormDescription>
                      <div className="mt-2">
                        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                          <CardContent className="p-6">
                            <FormField
                            control={form.control}
                            // rules={{required : "Video is required"}}
                            name="videoId"
                            render={({ field }) => (
                              <FormItem>
                                
                                <FormControl>
                                  <div className="text-center">
                                    <Label htmlFor="videos" className="cursor-pointer">
                                      <Video className="mx-auto h-12 w-12 text-muted-foreground cursor-pointer" />
                                    </Label>
                                    <Input
                                      id="videos"
                                      type="file"
                                      accept=".mp4,.mkv"
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        handleFileUpload(files, 'video');
                                        field.onChange(videosUrl); // update form value manually
                                      }}
                                    />
                                    
                                    <p className="text-xs text-muted-foreground mt-2">{videos ? videos?.[0]?.name : "only .mp4, .mkv allowed and Size should not be greater than 10mb"}</p>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                            />
                          </CardContent>
                        </Card>
                          
                      </div>
                    </div> */}
                    {/* Architechture */}
                    <div className="space-y-2">
                    <FormLabel>Architectural Plans(optional)</FormLabel>
                        <FormDescription>
                        Upload floor plans and architectural drawings
                        </FormDescription>
                        <div className="mt-2">
                            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                              <CardContent className="p-6">
                                <FormField
                                  control={form.control}
                                  name="architecturalPlanIds"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="text-center">
                                            <Label htmlFor="architecture" className="cursor-pointer">
                                            <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                                            </Label>
                                            <Input
                                            id="architecture"
                                            type="file"
                                            multiple
                                            accept="image/png, image/jpeg, application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                              const files = e.target.files;
                                              handleFileUpload(files, 'architecture');
                                              //field.onChange(architechturalImagesUrl); // update form value manually
                                            }}
                                            //onChange={(e) => handleFileUpload(e.target.files, 'architecture')}
                                          />
                                          <p className="text-xs text-muted-foreground mt-2">PNG, JPG, PDF up to 2MB each</p>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                </CardContent>
                            </Card>
                        
                            {architechturalImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                                {(architechturalImages as File[]).map((file, index) => (
                                    <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => removeFile(index, 'architecture')}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "details", "amenities", "media"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) setActiveTab(tabs[currentIndex -1]);
                    }}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "media" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ["basic", "details", "amenities", "media"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        console.log({currentIndex});
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="disabled:bg-slate-500 disabled:text-white cursor-default" 
                  disabled={!form.formState.isValid ? true : false}>
                    Create Listing
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
      {isLoading && <LoaderProcessor/>}
    </Dialog>
  );
}
