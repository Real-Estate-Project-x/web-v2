"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-interceptor";
import { useRouter } from "next/navigation";
import axios from "axios";

const profileSchema = z
  .object({
    logo: z.string().min(1, "Logo is required"),
    agencyName: z
      .string()
      .min(2, "Agency name must be at least 2 characters")
      .max(100),
    phoneNumber: z
      .string()
      .regex(/^(?:\+?234|0)(7|8|9)\d{9}$/, "Invalid phone number format"),
    businessAddress: z
      .string()
      .min(10, "Please provide a complete address")
      .max(200),
    isBusinessRegistered: z.boolean().optional(),
    rcNumber: z
      .string()
      .max(15, "Registration Number should not be more than 15 characters")
      .optional(),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(1000),
  })
  .refine(
    (data) => {
      if (data.isBusinessRegistered && !data.rcNumber) {
        return false;
      }
      return true;
    },
    {
      message: "RC Number is required for registered businesses",
      path: ["rcNumber"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      isBusinessRegistered: false,
    },
  });

  const isBusinessRegistered = watch("isBusinessRegistered");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setValue("logo", result);
      };
      reader.readAsDataURL(file);
      try {
        const formatData = new FormData();
        const images: File[] = [];
        images.push(file as File);
        images.forEach((file) => formatData.append("files[]", file));
        const responseData = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}upload-files`,
          { files: images },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (responseData?.data?.data?.length > 0)
          setLogoUrl(responseData.data.data[0]);
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    await axiosInstance
      .post("agency/create-agency/profile", {
        logo: logoUrl,
        agencyName: data.agencyName,
        phoneNumber: data.phoneNumber,
        businessAddress: data.businessAddress,
        isBusinessRegistered: data.isBusinessRegistered,
        rcNumber: data.rcNumber,
        description: data.description,
      })
      .then((response) => {
        if (response.data.success) {
          setTimeout(() => {
            toast.success("Profile saved successfully!", {
              description: "Your business profile has been completed",
            });
          }, 2000);
          router.push(`/login`);
        } else {
          toast.error("Sign Up failed. Please try again.");
        }
      })
      .catch((error) => {
        toast(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          {/* <Building2 className="h-6 w-6 text-primary" /> */}
          Business Profile
        </CardTitle>
        <CardDescription>
          Complete your agency profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Agency Logo *</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="logo"
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Upload your agency logo</p>
                <p>PNG, JPG up to 5MB</p>
              </div>
            </div>
            {errors.logo && (
              <p className="text-sm text-destructive">{errors.logo.message}</p>
            )}
          </div>

          {/* Agency Name */}
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agency Name *</Label>
            <Input
              id="agencyName"
              {...register("agencyName")}
              placeholder="Enter your agency name"
            />
            {errors.agencyName && (
              <p className="text-sm text-destructive">
                {errors.agencyName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            {/* <PhoneInput
              placeholder="Enter phone number"
              {...register("phoneNumber")}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg mt-1"
              defaultCountry="NG"
              onChange={(value: any) => {
                // setForm({ ...form, phone: value })
                console.log({ value });
                return String(value).trim();
              }}
            /> */}
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="08055123456"
              type="tel"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Business Address */}
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Textarea
              id="businessAddress"
              {...register("businessAddress")}
              placeholder="Enter your complete business address"
              className="resize-none"
              rows={3}
            />
            {errors.businessAddress && (
              <p className="text-sm text-destructive">
                {errors.businessAddress.message}
              </p>
            )}
          </div>

          {/* Business Registration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBusinessRegistered"
                checked={isBusinessRegistered}
                onCheckedChange={(checked) =>
                  setValue("isBusinessRegistered", checked === true)
                }
              />
              <Label
                htmlFor="isBusinessRegistered"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Business is registered
              </Label>
            </div>

            {/* RC Number (conditional) */}
            {isBusinessRegistered && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="rcNumber">RC Number *</Label>
                <Input
                  id="rcNumber"
                  type="text"
                  {...register("rcNumber")}
                  placeholder="Enter registration number"
                />
                {errors.rcNumber && (
                  <p className="text-sm text-destructive">
                    {errors.rcNumber.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your agency, services, and what makes you unique..."
              className="resize-none"
              rows={5}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
