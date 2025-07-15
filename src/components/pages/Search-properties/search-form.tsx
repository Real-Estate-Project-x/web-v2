'use client';
import { useState } from "react";
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

const PropertySearchForm = () => {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sizeRange, setSizeRange] = useState([500, 5000]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-4">Advanced Property Search</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="City, neighborhood, or zip code" 
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listing Type */}
        <div className="space-y-2">
          <Label>Listing Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Listings</SelectItem>
              <SelectItem value="for-sale">For Sale</SelectItem>
              <SelectItem value="for-rent">For Rent</SelectItem>
              <SelectItem value="sold">Recently Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select>
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
          <Select>
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
        <div className="space-y-2">
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
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label>Price Range</Label>
        <div className="px-4">
          <Slider
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
          </div>
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
          {[
            'Parking/Garage',
            'Swimming Pool',
            'Garden/Yard',
            'Balcony/Terrace',
            'Fireplace',
            'Air Conditioning',
            'Hardwood Floors',
            'Updated Kitchen',
            'Walk-in Closet',
            'Laundry Room',
            'Pet Friendly',
            'Furnished'
          ].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={amenity} />
              <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 py-4 border-t ">
        <Button className="bg-real-600 hover:bg-real-700">
          Apply Filters
        </Button>
        <Button variant="outline">
          Reset Filters
        </Button>
        <Button variant="ghost">
          Save Search
        </Button>
      </div>
    </div>
  );
};

export default PropertySearchForm;