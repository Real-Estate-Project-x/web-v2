'use client';

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { AgentDatabaseInterface } from "../../../../../../utils/interfaces";
import { convertDateCreatedToGetNumberOfDays } from "../../../../../../utils/helpers";

interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  daysOnMarket: number;
  views: number;
  isBoosted: boolean;
  image: string;
  dateAdded: string;
}

interface PropertyEditFormProps {
  property: AgentDatabaseInterface | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyData: Partial<AgentDatabaseInterface>) => void;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    type: "",
    status: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    description: ""
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        address: property.address,
        price: property.price.toString(),
        type: property.propertyType.name,
        status: property.status ? "Active" : "Sold",
        bedrooms: property.noOfBedrooms.toString(),
        bathrooms: property.noOfToilets.toString(),
        sqft: property.sizeInSquareFeet.toString(),
        description: `This beautiful ${property.propertyType.name.toLowerCase()} offers ${property.noOfBedrooms} bedrooms and ${property.noOfToilets} bathrooms in a prime location.`
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property || !formData.title || !formData.address || !formData.price || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedProperty: Partial<AgentDatabaseInterface> = {
      ...property,
      title: formData.title,
      address: formData.address,
      price: parseFloat(formData.price),
      //type : formData.type,
      status: formData.status.toLowerCase() === "active" ? true : false,
      noOfBedrooms: parseInt(formData.bedrooms) || 0,
      noOfToilets: parseFloat(formData.bathrooms) || 0,
      sizeInSquareFeet: parseInt(formData.sqft) || 0
    };

    onSave(updatedProperty);
    toast.success("Property updated successfully!");
    onClose();
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Property ID: #{property.id}</span>
              {/* {property.isBoosted && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Boosted
                </Badge>
              )} */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="my-2 w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
              
              <div>
                <Label htmlFor="edit-type">Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="my-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Family">Single Family</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


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
                rows={3}
                className="my-2"
              />
            </div>
          </div>

          {/* Property Stats */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Property Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Views:</span>
                {/* <span className="ml-2 font-medium">{property.views}</span> */}
              </div>
              <div>
                <span className="text-muted-foreground">Days on Market:</span>
                <span className="ml-2 font-medium">{convertDateCreatedToGetNumberOfDays(property.dateCreated)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Date Added:</span>
                <span className="ml-2 font-medium">{new Date(property.dateCreated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEditForm;