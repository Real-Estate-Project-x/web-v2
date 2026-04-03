import { useState } from "react";
import { DropZone } from "./upload-box";
import { ApiRequests } from "@/lib/api.request";
import { VideoIcon, ImageIcon, StickyNoteIcon } from "lucide-react";
import { PropertyUpFor } from "@/lib/constants";

interface Props {
  form: any;
  update: (key: string, value: any) => void;
  type: "edit" | "create";
}

export const MediaStep = ({ form, update, type }: Props) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [ownershipDocs, setOwnershipDocs] = useState<any[]>([]);

  // Images
  const addImages = async (files: File[]) => {
    const uploadedImages: any[] = await new ApiRequests().uploadPropertyImages(
      files
    );
    if (!uploadedImages?.length) return;

    setImages((prev) => {
      const updated = [...prev, ...uploadedImages];

      update(
        "photoIds",
        updated.map((img) => img.id)
      );

      return updated;
    });
  };

  const removeImage = async (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((f) => f.id !== id);

      update(
        "photoIds",
        updated.map((img) => img.id)
      );

      return updated;
    });

    await new ApiRequests().deleteFile(id);
  };

  // Video
  const addVideos = async (files: File[]) => {
    if (!files) return;

    const uploadedVideo = await new ApiRequests().uploadPropertyVideo(files[0]);
    const video = uploadedVideo[0];

    if (!video) return;

    setVideos((prev) => {
      const updated = [...prev, video];

      update("videoId", video.id);

      return updated;
    });
  };

  const removeVideo = async (id: string) => {
    setVideos((prev) => {
      const updated = prev.filter((f) => f.id !== id);

      update("videoId", "");

      return updated;
    });

    await new ApiRequests().deleteFile(id);
  };

  // Plans
  const addPlans = async (files: File[]) => {
    const uploadedPlans: any[] = await new ApiRequests().uploadPropertyImages(
      files
    );
    if (!uploadedPlans?.length) return;

    setPlans((prev) => {
      const updated = [...prev, ...uploadedPlans];

      update(
        "architecturalPlanIds",
        updated.map((plan) => plan.id)
      );

      return updated;
    });
  };

  const removePlan = async (id: string) => {
    setPlans((prev) => {
      const updated = prev.filter((f) => f.id !== id);

      update(
        "architecturalPlanIds",
        updated.map((plan) => plan.id)
      );

      return updated;
    });

    await new ApiRequests().deleteFile(id);
  };

  // Ownership docs
  const addOwnershipDocs = async (files: File[]) => {
    const uploadedOwnershipDocs: any[] =
      await new ApiRequests().uploadPropertyImages(files);
    if (!uploadedOwnershipDocs?.length) return;

    setOwnershipDocs((prev) => {
      const updated = [...prev, ...uploadedOwnershipDocs];

      update(
        "ownershipDocIds",
        updated.map((plan) => plan.id)
      );

      return updated;
    });
  };

  const removeOwnershipDoc = async (id: string) => {
    setOwnershipDocs((prev) => {
      const updated = prev.filter((f) => f.id !== id);

      update(
        "ownershipDocIds",
        updated.map((plan) => plan.id)
      );

      return updated;
    });

    await new ApiRequests().deleteFile(id);
  };

  return (
    <div className="space-y-6">
      {/* Videos */}
      <DropZone
        label="Property Video (Optional)"
        sublabel="Upload Property Video"
        warninglabel={
          type === "edit"
            ? "NOTE: This field overwrites the previous video"
            : ""
        }
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
        warninglabel={
          type === "edit"
            ? "NOTE: This field overwrites all previous images"
            : ""
        }
        label="Property Images (Optional)"
        sublabel="Upload Property Images (You can upload multiple images)"
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple={true}
        icon={<ImageIcon />}
        hint={"PNG, JPG, GIF up to 2MB each"}
        files={images}
        onAdd={addImages}
        onRemove={removeImage}
      />

      {/* Arch_plans */}
      <DropZone
        label="Architectural Plans (Optional)"
        warninglabel={
          type === "edit"
            ? "NOTE: This field overwrites all previous plans"
            : ""
        }
        sublabel="Upload floor plans and architectural drawings"
        accept="image/*,application/pdf"
        multiple={true}
        icon={<StickyNoteIcon />}
        hint={"PDF, PNG, JPG up to 10MB each"}
        files={plans}
        onAdd={addPlans}
        onRemove={removePlan}
      />

      {/* Ownership docs */}
      {form && form.upFor === PropertyUpFor.SALE && (
        <DropZone
          label="Ownership docs (Optional)"
          warninglabel={
            type === "edit"
              ? "NOTE: This field overwrites all ownership docs"
              : ""
          }
          sublabel="Upload ownership docs I.E C_of_O, Deeds"
          accept="image/*,application/pdf"
          multiple={true}
          icon={<StickyNoteIcon />}
          hint={"PDF, PNG, JPG up to 10MB each"}
          files={ownershipDocs}
          onAdd={addOwnershipDocs}
          onRemove={removeOwnershipDoc}
        />
      )}
    </div>
  );
};
