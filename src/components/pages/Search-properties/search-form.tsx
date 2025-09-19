'use client';
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

type Props = {
  setInputValue : Function;
  setPropertyType : Function;
  setListingType : Function;
  setBedrooms : Function;
  setBathrooms : Function;
  setMinPrice : Function;
  setMaxPrice : Function;
  sizeRange : number[];
  setSizeRange : (value : number[]) => void;
  setKidsArea : Function;
  setHasWifi : Function;
  setCarParking : Function;
  setHasGym : Function;
  setHasLaundry : Function;
  setHasCCTV : Function;
  setIsNewBuilding : Function;
  setIsPetFriendly : Function;
  inputValue : string;
  listingType : string;
  // propertyType : string;
  setLoader : Function;
  loader : boolean;
  onSubmit : (filter : string, query : string, flag : boolean) => void;
};


const PropertySearchForm :FC<Props> = ({
  setInputValue ,
  setPropertyType ,
  setListingType ,
  setBedrooms ,
  setBathrooms ,
  setMinPrice ,
  setMaxPrice ,
  sizeRange,
  setSizeRange,
  setKidsArea ,
  setHasWifi ,
  setCarParking ,
  setHasGym ,
  setHasLaundry ,
  setHasCCTV ,
  setIsNewBuilding ,
  setIsPetFriendly ,
  loader,
  inputValue ,
  listingType ,
  setLoader,
  // propertyType,
  onSubmit
}) => {
  // const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenities = [
    "Has Car Parking",
    "Has Gym Area",
    "Has Kids Area",
    "Is New Building",
    "Has CCTV",
    "Is Pet Friendly",
    "Has Wifi",
    "Has Laundry",
  ];

  const onChangeCheckbox = (title : string, checked : boolean) => {
     if (checked) {
      setSelectedAmenities((prev) => [...prev, title]); // add
    } else {
      setSelectedAmenities((prev) => prev.filter((a) => a !== title)); // remove
    }

  }

  useEffect(() => {

    if(selectedAmenities.includes('Has Kids Area')){
      setKidsArea(true);
    }else{
      setKidsArea(false);
    }
    if(selectedAmenities.includes('Has Wifi')){
      setHasWifi(true);
    }else{
      setHasWifi(false);
    } 
    if(selectedAmenities.includes('Has Car Parking')){
      setCarParking(true);
    }else setCarParking(false);

    if(selectedAmenities.includes('Has Gym Area')){
      setHasGym(true);
    }else setHasGym(false);

    if(selectedAmenities.includes('Has Laundry')){
      setHasLaundry(true);
    }else setHasLaundry(false);

    if(selectedAmenities.includes('Has CCTV')){
      setHasCCTV(true);
    }else setHasCCTV(false);

    if(selectedAmenities.includes('Is New Building')){
      setIsNewBuilding(true);
    }else setIsNewBuilding(false);
    
    if(selectedAmenities.includes('Is Pet Friendly')){  
      setIsPetFriendly(true);
    }else setIsPetFriendly(false);

  },[selectedAmenities]);


  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-4">Advanced Property Search</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        setLoader(true);
        onSubmit(inputValue, listingType, true);
      }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="City, neighborhood, or zip code" 
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select onValueChange={(value) => setPropertyType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Flat">Flat</SelectItem>
                  <SelectItem value="Bungalow">Bungalow</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  {/* <SelectItem value="villa">Villa</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Listing Type */}
            <div className="space-y-2">
              <Label>Listing Type</Label>
              <Select onValueChange={(value) => setListingType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="SALE">For Sale</SelectItem>
                  <SelectItem value="RENT">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Select onValueChange={(value) => setBedrooms(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select onValueChange={(value) => setBathrooms(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Built */}
            {/* <div className="space-y-2">
              <Label>Year Built</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Year</SelectItem>
                  <SelectItem value="2020">2020+</SelectItem>
                  <SelectItem value="2015">2015+</SelectItem>
                  <SelectItem value="2010">2010+</SelectItem>
                  <SelectItem value="2000">2000+</SelectItem>
                  <SelectItem value="1990">1990+</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label>Price Range</Label>
            <div className="flex flex-row items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="startPrice" className="font-normal">Start&nbsp;Price&nbsp;₦</Label>
                <Input 
                  id="startPrice" 
                  placeholder="Enter Start price" 
                  type="number"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endPrice" className="font-normal">End&nbsp;Price&nbsp;₦</Label>
                <Input 
                  id="endPrice" 
                  type="number"
                  placeholder="Enter End price" 
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              {/* <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2000000}
                min={0}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div> */}
            </div>
          </div>

          {/* Square Footage */}
          <div className="space-y-4">
            <Label>Square Footage</Label>
            <div className="px-4">
              <Slider
                value={sizeRange}
                onValueChange={setSizeRange}
                max={5000}
                min={500}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{sizeRange[0].toLocaleString()} sqft</span>
                <span>{sizeRange[1].toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label>Amenities & Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                  id={amenity}
                  value={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => onChangeCheckbox(amenity, checked as boolean)}/>

                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 py-4 border-t ">
            <Button type="submit"
             disabled={loader} 
             //onClick={() => onSubmit(inputValue, listingType, true)} 
             className="bg-[#486581] hover:bg-[#334E68] disabled:opacity-50 ">
              {loader ? "Apply filters..." : "Apply"}
            </Button>
            <Button type="button" variant="outline"
            onClick={() => {
              setInputValue("");
              setPropertyType("");
              setListingType("");
              setBedrooms(0);
              setBathrooms(0);
              setMinPrice("");
              setMaxPrice("");
              setSizeRange([500, 5000]);
              setSelectedAmenities([]);
              setLoader(false);

              //onSubmit("", "", false);
            }}>
              Reset Filters
            </Button>
            {/* <Button variant="ghost">
              Save Search
            </Button> */}
          </div>
        </form>
    </div>
  );
};

export default PropertySearchForm;