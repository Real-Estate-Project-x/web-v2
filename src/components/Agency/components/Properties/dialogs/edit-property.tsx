'use client';

import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Video} from "lucide-react";
import { toast } from "sonner";
import { AgentDatabaseInterface, CountryStatesInterface, PropertyTypesInterface } from "../../../../../../utils/interfaces";
import { axiosInstance } from "@/lib/axios-interceptor";
import axios from "axios";
import { pickUserId } from "../../../../../../utils/helpers";

interface PropertyEditFormProps {
  property: AgentDatabaseInterface | null;
  isOpen: boolean;
  onClose: () => void;
  index : number;
  onSave: () => void;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({
  property,
  isOpen,
  onClose,
  onSave,
  index
}) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    type: "",
    listingType: "",
    paymentPlan : "",
    bedrooms: "",
    bathrooms: "",
    kitchen : "",
    sqft: "",
    state : "",
    description: "",
    isNewProperty : false,
    hasLaundry : false,
    hasWifi : false,
    hasCarParking : false,
    hasKidsPlayArea : false,
    hasCCtv : false,
    hasGym : false,
    category : ""

  });
  const [propertTypes, setPropertyTypes] = useState<PropertyTypesInterface[]>([] as PropertyTypesInterface[]);
  const [countryStates, setCountryStates] =  useState<CountryStatesInterface[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videosUrl, setVideosUrl] = useState<string[]>([]);
  const [isLoading, setLoader] = useState(false);
  const [_defaultState, setDefaultState] = useState({} as CountryStatesInterface);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleFileUpload = (files: FileList | null, type: 'image' | 'video' | 'architecture') => {
    if (!files) return;
      
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if(type === 'video')
      return file.type.startsWith('video/');
      
    });
    setVideos(validFiles);
  };

  const newUploadFiles = (array : any, type : 'image' | 'video'|'architecture') => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}upload-files`, {
      files : array
    }, {headers : {
      'Content-Type' : 'multipart/form-data'
    }}).then(res => {
        setVideosUrl(res.data?.data);
    }).catch(err => {
      toast.error(err?.response?.data?.message);
    });
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    const agentId = pickUserId();

    // add additional costs for agent, geo cor longitude and lattitude,
    try{
      await axiosInstance.patch(`property`, {
        propertyTypeId: formData?.type,
        title: formData?.title,
        address: formData?.address,
        upFor: formData?.listingType,
        propertyCategory: property?.propertyCategory,
        description : formData?.description,
        price : parseInt(formData?.price),
        // "additionalCosts": [
        //   {
        //     "title": "Agent fee",
        //     "price": 5000
        //   }
        // ],
        paymentCoverageDuration: formData?.paymentPlan,
        agencyId : agentId,
        stateId: formData?.state,
        sizeInSquareFeet : formData?.sqft,
        // "geoCoordinates": {
        //   "latitude": 40.7128,
        //   "longitude": -74.006
        // },
        videoUrl : videosUrl?.length > 0 ? videosUrl[0] : "",
        // "architecturalPlanUrls": [
        //   "string"
        // ],
        noOfBedrooms : parseInt(formData?.bedrooms),
        noOfToilets :  parseInt(formData?.bathrooms),
        noOfKitchens : parseInt(formData?.kitchen),
        hasLaundry: formData?.hasLaundry,
        hasWifi: formData?.hasWifi,
        hasCarParking: formData?.hasCarParking,
        hasKidsPlayArea: formData?.hasKidsPlayArea,
        hasCctv: formData?.hasCCtv,
        hasGym: formData?.hasGym,
        isNewBuilding: formData?.isNewProperty,
        propertyId: property?.id,
        createdByUserId: property?.postedByUserId
      }).then((response) => {
        if(response?.data?.success){
          onSave();
          toast.success("Property updated successfully!");
          //update state to refresh endpoint
        }
      
      }).catch((err) => {
        console.log({err});
      })
    } catch(err){

    }
    setLoader(false); 
    onClose();
  };

  useEffect(() => {
    if (property) {
      setFormData({
        title: property?.title,
        address: property?.address,
        price: property?.price?.toString(),
        type: property?.propertyTypeId,
        listingType: property?.upFor,
        paymentPlan : property?.paymentCoverageDuration,
        bedrooms: property?.noOfBedrooms?.toString(),
        bathrooms: property?.noOfToilets?.toString(),
        sqft: property?.sizeInSquareFeet?.toString(),
        description: property?.description,
        state: property?.stateId,
        hasLaundry : property?.hasLaundry || false,
        hasWifi : property?.hasWifi || false,
        hasCarParking : property?.hasCarParking || false,
        hasKidsPlayArea : property?.hasKidsPlayArea || false,
        hasCCtv : property?.hasCctv || false,
        hasGym : property?.hasGym || false,
        kitchen : property?.noOfKitchens?.toString(),
        isNewProperty : property?.isNewBuilding,
        category : property?.propertyCategory
      });

      axiosInstance.get('country/states/all?countryId=0b7c1c4d-65a5-484d-9b03-8c6b36d09634')
      .then(res => {
        setCountryStates(res?.data?.data);
        const _defaultState = res?.data?.data?.find(({id} : CountryStatesInterface) => id === property?.stateId);
        setDefaultState(_defaultState); 
      }).catch(err => {
        console.error({err});
      });
    }
  }, [property]);

  useEffect(() => {
    axiosInstance.get('property-type')
      .then(res => {
        setPropertyTypes(res.data.data);
      }).catch(err => {
        console.error({err});
      });
  },[]);

  useEffect(() => {
    if (videos) {
      const formData = new FormData();
      videos.forEach(file => formData.append('files[]', file));
      newUploadFiles(videos, 'video');
    }
  },[videos]);

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="
        w-[95vw]
        max-w-full
        sm:max-w-[95vw]
        md:max-w-5xl
        lg:max-w-6xl
        max-h-[90vh]
        overflow-y-auto
        bg-white">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Property ID: #{index}</span>
            </div>
            
            <div>
              <Label htmlFor="edit-title">Property Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="my-2"
              />
            </div>
            <div className={`grid grid-cols-1 ${formData.listingType === "RENT" ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
              <div>
                <Label htmlFor="edit-status">Listing&nbsp;Type</Label>
                <Select value={formData.listingType} onValueChange={(value) => handleInputChange("listingType", value)}>
                  <SelectTrigger className="my-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="RENT">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.listingType === "RENT" && (
                <div>
                  <Label htmlFor="edit-status">Payment&nbsp;Coverage</Label>
                  <Select value={formData.paymentPlan} onValueChange={(value) => handleInputChange("paymentPlan", value)}>
                    <SelectTrigger className="my-2 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="edit-type">Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="my-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={property?.propertyType?.name}>{property?.propertyType?.name}</SelectItem>
                    {propertTypes && propertTypes?.map((data : PropertyTypesInterface, i : number) => 
                      <SelectItem key={`${i}-${data?.id}`} className="capitalize" value={data.id}>{data.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className="my-2 w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={_defaultState?.name}>{_defaultState?.name}</SelectItem>
                    {countryStates && countryStates?.map((data : CountryStatesInterface) => 
                      <SelectItem key={Math.random()} className="capitalize" value={data.id}>{data.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

                
            </div>

            <section className="w-full grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className="my-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-kitchen">Kitchen</Label>
                <Input
                  id="edit-kitchen"
                  type="number"
                  value={formData.kitchen}
                  onChange={(e) => handleInputChange("kitchen", e.target.value)}
                  required
                  className="my-2"
                />
              </div>
              {/* <div>
                <Label htmlFor="edit-status">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="my-2 w-full">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {countryStates && countryStates?.map((data : CountryStatesInterface) => 
                      <SelectItem key={Math.random()} className="capitalize" value={data.id}>{data.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div> */}
              {/* radio section button to select if property is new or not */}
              <RadioGroup
                defaultValue="new"
                className="flex gap-6"
                name="propertyCondition">
                <div className="flex items-center gap-2">
                  <Label htmlFor="new">Is this Property New?</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="new" />
                  <Label htmlFor="new">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="old" />
                  <Label htmlFor="old">No</Label>
                </div>
              </RadioGroup>

            </section>
           

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  className="my-2"
                />
              </div>
            
              
              <div>
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Input
                  id="edit-bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  className="my-2"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Input
                  id="edit-bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  className="my-2"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-sqft">Square Feet</Label>
                <Input
                  id="edit-sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => handleInputChange("sqft", e.target.value)}
                  className="my-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="my-2"
              />
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Property Features</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasWifi}
                    onChange={(e) => handleInputChange("hasWifi", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">WiFi</Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasCCtv}
                    onChange={(e) => handleInputChange("hasCCtv", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">CCTV</Label>
                </div>
                
                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasLaundry}
                    onChange={(e) => handleInputChange("hasLaundry", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">Laundry</Label>
                </div>
                
                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasKidsPlayArea}
                    onChange={(e) => handleInputChange("hasKidsPlayArea", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">Kids Area</Label>
                </div>

                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasGym}
                    onChange={(e) => handleInputChange("hasGym", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">Gym</Label>
                </div>
                
                <div className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">  
                  <input type="checkbox"
                    checked={formData.hasCarParking}
                    onChange={(e) => handleInputChange("hasCarParking", e.target.checked)}
                  />
                  <Label className="font-normal cursor-pointer">Car Parking</Label>
                </div>
              </div>
            </div>

            {/* Video section */}
            <div className="w-full h-64">
              <Label>Property Videos</Label>
              <p className="py-1">
                Upload Property Video
              </p>
              <div className="w-full mt-2 h-full text-center flex justify-center border border-dashed border-gray-500 border-2 rounded-xl">
                <Label htmlFor="videos" className="cursor-pointer">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground cursor-pointer" />
                  <p>Click to browse</p>
                </Label>
                <Input
                  id="videos"
                  type="file"
                  accept=".mp4,.mkv"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    handleFileUpload(files, 'video');
                   // update form value manually
                  }}
                />
                
                <p className="text-xs text-muted-foreground mt-2">{videos ? videos?.[0]?.name : "only .mp4, .mkv allowed and Size should not be greater than 10mb"}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-16">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
        {isLoading && <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50"/>}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEditForm;