import { Input } from "@/components/ui/input";
import { BarChart3, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { getPropertyType } from "@/lib/utils";
import { PaymentDuration } from "@/lib/constants";

interface Props {
  form: any;
  update: <T>(key: string, value: T) => void;
  propertyTypes: { id: string; name: string; tag: string }[];
}

export const DetailsStep = ({ form, update, propertyTypes }: Props) => {
  const costs = form.additionalCosts;

  const addCost = () => {
    update("additionalCosts", [...costs, { title: "", price: 0 }]);
  };

  const removeCost = (index: number) => {
    const updated = costs.filter((_: any, i: number) => i !== index);
    update("additionalCosts", updated);
  };

  const updateCost = (index: number, key: string, value: any) => {
    const updated = [...costs];
    updated[index][key] = value;
    update("additionalCosts", updated);
  };

  return (
    <section>
      <div className="space-y-4">
        <Select
          value={form.propertyTypeId}
          onValueChange={(value) => update("propertyTypeId", value)}
        >
          <SelectTrigger className="w-full py-6 capitalize">
            <BarChart3 />
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem className="capitalize" value={type.id} key={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {getPropertyType(form.propertyTypeId, propertyTypes)?.tag ===
          "RESIDENTIAL" && (
          <>
            <Input
              className="pl-10 py-6"
              type="number"
              min={1}
              placeholder="Bedrooms"
              value={form.noOfBedrooms}
              onChange={(e) => update("noOfBedrooms", e.target.value)}
            />

            <Input
              className="pl-10 py-6"
              type="number"
              min={1}
              placeholder="Toilets"
              value={form.noOfToilets}
              onChange={(e) => update("noOfToilets", e.target.value)}
            />

            <Input
              className="pl-10 py-6"
              type="number"
              min={1}
              placeholder="Kitchens"
              value={form.noOfKitchens}
              onChange={(e) => update("noOfKitchens", e.target.value)}
            />
          </>
        )}
      </div>

      <div className="space-y-4 pt-5">
        <Input
          className="pl-10 py-6"
          type="number"
          min={1}
          placeholder="Square Footage [SQft]"
          value={form.sizeInSquareFeet}
          onChange={(e) => update("sizeInSquareFeet", e.target.value)}
        />

        <Input
          className="pl-10 py-6"
          type="number"
          min={1}
          placeholder="Internet Speed"
          value={form.averageBroadbandSpeedInMegabytes}
          onChange={(e) =>
            update("averageBroadbandSpeedInMegabytes", e.target.value)
          }
        />

        <Select
          value={form.paymentCoverageDuration}
          onValueChange={(value) => update("paymentCoverageDuration", value)}
        >
          <SelectTrigger className="w-full py-6">
            <BarChart3 />
            <SelectValue placeholder="Payment Coverage" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PaymentDuration).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="pl-10 py-6"
          type="number"
          min={1}
          placeholder="Price [Additional fees are NOT included]"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />
      </div>

      {/* 🔥 Additional Costs Section */}
      <div className="space-y-3 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-medium">Additional Costs</p>

          <button
            type="button"
            onClick={addCost}
            className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Cost
          </button>
        </div>

        {costs.length === 0 && (
          <p className="text-sm text-gray-400">No additional costs added</p>
        )}

        <div className="space-y-3">
          {costs.map((cost: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
            >
              {/* Title */}
              <Input
                readOnly={index === 0}
                className="md:col-span-3 py-6"
                placeholder="e.g. Agent Fee"
                value={cost.title}
                onChange={(e: any) =>
                  updateCost(index, "title", e.target.value)
                }
              />

              {/* Price */}
              <Input
                className="md:col-span-1 py-6"
                type="number"
                placeholder="Price"
                min={1}
                value={cost.price}
                onChange={(e: any) =>
                  updateCost(index, "price", e.target.value)
                }
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeCost(index)}
                className="cursor-pointer flex items-center justify-center h-11 border rounded-lg bg-[#F94B3F] text-white hover:bg-red-100  hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
