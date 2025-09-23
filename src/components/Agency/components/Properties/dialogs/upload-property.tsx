'use client';

import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Video, Plus } from "lucide-react";
import { toast } from "sonner";

interface PropertyUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: any) => void;
}

const PropertyUploadForm: React.FC<PropertyUploadFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    description: ""
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (type === 'image') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    if (type === 'image') {
      setImages(prev => [...prev, ...validFiles]);
    } else {
      setVideos(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.address || !formData.price || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const propertyData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseFloat(formData.bathrooms) || 0,
      sqft: parseInt(formData.sqft) || 0,
      images,
      videos,
      status: "Active",
      isBoosted: false,
      views: 0,
      daysOnMarket: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onSubmit(propertyData);
    
    // Reset form
    setFormData({
      title: "",
      address: "",
      price: "",
      type: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      description: ""
    });
    setImages([]);
    setVideos([]);
    
    toast.success("Property uploaded successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Upload New Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Modern Downtown Condo"
                  className="my-2"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}
        >
                  <SelectTrigger className="w-full my-2">
                    <SelectValue placeholder="Select type" />
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="e.g., 123 Main Street, City, State"
                required
                className="my-2"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="425000"
                  required
                  className="my-2"
                />
              </div>
              
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  placeholder="3"
                  className="my-2"
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  placeholder="2.5"
                  className="my-2"
                />
              </div>
              
              <div>
                <Label htmlFor="sqft">Square Feet</Label>
                <Input
                  id="sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => handleInputChange("sqft", e.target.value)}
                  placeholder="1200"
                  className="my-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the property features, amenities, and highlights..."
                rows={4}
                className="my-2"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Upload</h3>
            
            {/* Images */}
            <div>
              <Label>Property Images</Label>
              <div className="mt-2">
                <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Label htmlFor="images" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary">Upload images</span>
                          <span className="text-sm text-muted-foreground"> or drag and drop</span>
                        </Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files, 'image')}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </CardContent>
                </Card>
                
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((file, index) => (
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
                          onClick={() => removeFile(index, 'image')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Videos */}
            <div>
              <Label>Property Videos</Label>
              <div className="mt-2">
                <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Label htmlFor="videos" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary">Upload videos</span>
                          <span className="text-sm text-muted-foreground"> or drag and drop</span>
                        </Label>
                        <Input
                          id="videos"
                          type="file"
                          multiple
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files, 'video')}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">MP4, MOV, AVI up to 50MB each</p>
                    </div>
                  </CardContent>
                </Card>
                
                {videos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {videos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <Video className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(1)}MB</Badge>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(index, 'video')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Upload Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyUploadForm;