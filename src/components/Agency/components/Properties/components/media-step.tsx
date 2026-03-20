import { useState } from "react";
import { UploadedFile, DropZone } from "./upload-box";
import { VideoIcon, ImageIcon, StickyNoteIcon } from "lucide-react";

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
