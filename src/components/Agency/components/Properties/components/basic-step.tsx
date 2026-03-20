import { useEffect, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropertyUpFor } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { AddressAutocompletion } from "../../../../../../utils/interfaces";

interface Props {
  form: any;
  addressesList: AddressAutocompletion[];
  update: <T>(key: string, value: T) => void;
  onAddressAutocomplete: (address: string) => void;
  onAddressSelection: (stateName: string) => void;
}

export const BasicStep = ({
  form,
  update,
  addressesList,
  onAddressSelection,
  onAddressAutocomplete,
}: Props) => {
  const addressRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  useEffect(() => {
    if (!showLocationDropdown || !addressRef.current) return;

    const rect = addressRef.current.getBoundingClientRect();

    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      // top: rect.bottom + 2,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, [showLocationDropdown, form.address]);

  const addressUpdate = (address: string) => {
    setShowLocationDropdown(true);
    update("address", address);

    setTimeout(() => {
      onAddressAutocomplete(address);
    }, 5000);
  };

  return (
    <section>
      <div className="space-y-4">
        <Input
          className="pl-10 py-6"
          placeholder="Property Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <Textarea
          id="description"
          placeholder="Brief description of the property..."
          value={form.description}
          onChange={(e: any) => update("description", e.target.value)}
          rows={50}
        />

        <div ref={addressRef}>
          <Input
            className="pl-10 py-6"
            placeholder="Address"
            value={form.address}
            onChange={(e) => addressUpdate(e.target.value)}
          />
        </div>
        {showLocationDropdown && addressesList?.length > 0 && (
          <div
            style={dropdownStyle}
            className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
          >
            {addressesList?.length > 0 ? (
              addressesList.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    if (!item) return;

                    setShowLocationDropdown(false);

                    update("address", item.formattedAddress);

                    update("geoCoordinates", {
                      latitude: +item.geolocation.latitude,
                      longitude: +item.geolocation.longitude,
                    });

                    onAddressSelection(item.state);
                  }}
                >
                  {item.formattedAddress}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}

        <Select
          value={form.upFor}
          onValueChange={(value) => update("upFor", value)}
        >
          <SelectTrigger className="w-full py-6 capitalize">
            <BarChart3 />
            <SelectValue placeholder="Up For" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PropertyUpFor).map((type) => (
              <SelectItem value={type} key={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
};
