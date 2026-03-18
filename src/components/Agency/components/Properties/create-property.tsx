"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  ImageIcon,
  Plus,
  StickyNoteIcon,
  Trash2,
  UploadIcon,
  Video,
  VideoIcon,
} from "lucide-react";
import { DropZone, UploadedFile } from "./components/upload-box";

const steps = ["Basic", "Details", "Amenities", "Media"];

export const BasicStep = ({ form, update }: any) => {
  return (
    <section>
      <div className="space-y-4">
        <Input
          className="pl-10 py-6"
          placeholder="Property Title"
          value={form.title}
          onChange={(v: any) => update("title", v)}
        />

        <Textarea
          id="description"
          placeholder="Brief description of the property..."
          value={form.description}
          onChange={(e: any) => update("description", e.target.value)}
          rows={50}
        />

        <Select>
          <SelectTrigger className="w-full py-6">
            <BarChart3 />
            <SelectValue placeholder="Up For" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRICE">Sale</SelectItem>
            <SelectItem value="VIEWS">Rent</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="pl-10 py-6"
          placeholder="Address"
          value={form.title}
          onChange={(v: any) => update("title", v)}
        />

        <Select>
          <SelectTrigger className="w-full py-6">
            <BarChart3 />
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRICE">Flat</SelectItem>
            <SelectItem value="VIEWS">Apartments</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
};

export const DetailsStep = ({ form, update }: any) => {
  const costs = form.additionalCosts || [{ title: "Agency Fee", price: 0 }];

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
        <Select>
          <SelectTrigger className="w-full py-6">
            <BarChart3 />
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRICE">Flat</SelectItem>
            <SelectItem value="VIEWS">Bungalow</SelectItem>
            <SelectItem value="VIEWS">Duplex</SelectItem>
          </SelectContent>
        </Select>

        <>
          <Input
            className="pl-10 py-6"
            type="number"
            min={1}
            placeholder="Bedrooms"
            value={form.title}
            onChange={(v: any) => update("noOfBedrooms", v)}
          />

          <Input
            className="pl-10 py-6"
            type="number"
            min={1}
            placeholder="Toilets"
            value={form.title}
            onChange={(v: any) => update("noOfToilets", v)}
          />

          <Input
            className="pl-10 py-6"
            type="number"
            min={1}
            placeholder="Kitchens"
            value={form.title}
            onChange={(v: any) => update("noOfKitchens", v)}
          />
        </>
      </div>

      <div className="space-y-4 pt-5">
        <Input
          className="pl-10 py-6"
          type="number"
          min={1}
          placeholder="Square Footage"
          value={form.title}
          onChange={(v: any) => update("sizeInSquareFeet", v)}
        />

        <Select>
          <SelectTrigger className="w-full py-6">
            <BarChart3 />
            <SelectValue placeholder="Payment Coverage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRICE">Yearly</SelectItem>
            <SelectItem value="VIEWS">Bi-Annually</SelectItem>
            <SelectItem value="VIEWS">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="pl-10 py-6"
          type="number"
          min={1}
          placeholder="Price"
          value={form.title}
          onChange={(v: any) => update("price", v)}
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
                value={cost.price}
                onChange={(e: any) =>
                  updateCost(index, "price", Number(e.target.value))
                }
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeCost(index)}
                className="flex items-center justify-center h-11 border rounded-lg hover:bg-red-50 text-red-500"
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

export const AmenitiesStep = ({ form, update }: any) => {
  const items = [
    "hasLaundry",
    "hasWifi",
    "hasCarParking",
    "hasKidsPlayArea",
    "hasCctv",
    "hasGym",
    "isNewBuilding",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((key) => (
        <label
          key={key}
          className="flex items-center gap-2 border p-3 rounded-lg"
        >
          <input
            type="checkbox"
            checked={form[key]}
            onChange={(e) => update(key, e.target.checked)}
          />
          <span className="capitalize">{key.replace("has", "")}</span>
        </label>
      ))}
    </div>
  );
};

export const MediaStep = ({ form, update }: any) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  function toUploadedFiles(files: File[]): UploadedFile[] {
    const uid = Math.random().toString(36).slice(2, 10);
    return files.map((file) => ({
      id: uid,
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
  }

  // Images
  const addImages = (files: File[]) =>
    setImages((prev) => [...prev, ...toUploadedFiles(files)]);
  const removeImage = (id: string) =>
    setImages((p) => p.filter((f) => f.id !== id));

  // Video
  const addVideos = (files: File[]) =>
    setVideos((prev) => [...prev, ...toUploadedFiles(files)]);
  const removeVideo = (id: string) =>
    setVideos((p) => p.filter((f) => f.id !== id));

  // Plans
  const addPlans = (files: File[]) =>
    setPlans((prev) => [...prev, ...toUploadedFiles(files)]);
  const removePlan = (id: string) =>
    setPlans((p) => p.filter((f) => f.id !== id));

  return (
    <div className="space-y-6">
      {/* <UploadBox title="Property Images" subtitle="PNG, JPG up to 2MB" /> */}

      {/* Videos */}
      <DropZone
        label="Property Video (Optional)"
        sublabel="Upload Property Video"
        accept="video/*"
        multiple={false}
        icon={<VideoIcon />}
        hint={"MP4, MOV, AVI up to 100MB"}
        files={videos}
        onAdd={addVideos}
        onRemove={removeVideo}
      />

      {/* Images */}
      <DropZone
        label="Property Images (Required)"
        sublabel="Upload Property Images (You can upload multiple images)"
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple
        icon={<ImageIcon />}
        hint={"PNG, JPG, GIF up to 2MB each"}
        files={images}
        onAdd={addImages}
        onRemove={removeImage}
      />

      <DropZone
        label="Architectural Plans (Optional)"
        sublabel="Upload floor plans and architectural drawings"
        accept="image/*,application/pdf"
        multiple
        icon={<StickyNoteIcon />}
        hint={"PDF, PNG, JPG up to 10MB each"}
        files={plans}
        onAdd={addPlans}
        onRemove={removePlan}
      />
    </div>
  );
};

export const CreateProperty = ({}) => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    propertyTypeId: "",
    title: "",
    address: "",
    upFor: "SALE",
    propertyCategory: "",
    description: "",
    price: 0,
    paymentCoverageDuration: "YEARLY",
    stateId: "",
    agencyId: "",
    sizeInSquareFeet: 0,
    geoCoordinates: { latitude: 0, longitude: 0 },
    averageBroadbandSpeedInMegabytes: 0,
    noOfBedrooms: 0,
    noOfToilets: 0,
    noOfKitchens: 0,

    // amenities
    hasLaundry: false,
    hasWifi: false,
    hasCarParking: false,
    hasKidsPlayArea: false,
    hasCctv: false,
    hasGym: false,
    isNewBuilding: false,

    // media
    photoIds: [],
    videoId: "",
    architecturalPlanIds: [],
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Create Property Listing</h1>
      <p className="text-gray-500 text-sm mb-6">
        Fill in the details below to list your property
      </p>

      {/* Step Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              step === i ? "bg-white shadow" : "text-gray-500 hover:text-black"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {/* Step Content */}
      {step === 0 && <BasicStep form={form} update={update} />}
      {step === 1 && <DetailsStep form={form} update={update} />}
      {step === 2 && <AmenitiesStep form={form} update={update} />}
      {step === 3 && <MediaStep form={form} update={update} />}

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 border rounded-lg"
            >
              Previous
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button className="px-4 py-2 bg-black text-white rounded-lg">
              Create Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
