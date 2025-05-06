'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoreFiltersModal = ({ isOpen, onClose }: MoreFiltersModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>More Filters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Property Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="parking" />
                <Label htmlFor="parking">Parking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="pool" />
                <Label htmlFor="pool">Pool</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="garden" />
                <Label htmlFor="garden">Garden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="furnished" />
                <Label htmlFor="furnished">Furnished</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Additional Options</h3>
            <div className="grid gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Year Built" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="2020">2020+</SelectItem>
                  <SelectItem value="2015">2015+</SelectItem>
                  <SelectItem value="2010">2010+</SelectItem>
                  <SelectItem value="2000">2000+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Square Footage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1000">1000+ sqft</SelectItem>
                  <SelectItem value="1500">1500+ sqft</SelectItem>
                  <SelectItem value="2000">2000+ sqft</SelectItem>
                  <SelectItem value="3000">3000+ sqft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoreFiltersModal;