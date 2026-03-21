"use client";

import { useState, useCallback, useRef } from "react";

export interface UploadedFile {
  id: string;
  url: string;
  mimeType: string;
  cloudFileId: string;
}

interface DropZoneProps {
  label: string;
  sublabel: string;
  accept: string;
  multiple?: boolean;
  icon: React.ReactNode;
  hint: string;
  files: UploadedFile[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}

const VideoIcon = () => (
  <svg
    className="w-10 h-10 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.2}
  >
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3V10z" />
  </svg>
);

const PlanIcon = () => (
  <svg
    className="w-10 h-10 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.2}
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function FileThumb({
  uf,
  onRemove,
}: {
  uf: UploadedFile;
  onRemove: () => void;
}) {
  const isImage = uf.mimeType.startsWith("image/");
  const isVideo = uf.mimeType.startsWith("video/");
  const nameComponent = uf.url.split("/").pop()?.split(".").shift();

  if (!nameComponent) return;

  const name =
    nameComponent.length > 18
      ? nameComponent.slice(0, 15) + "…"
      : nameComponent;

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 p-2 h-24 w-24 shrink-0">
      {isImage && uf.url ? (
        <img
          src={uf.url}
          alt={name}
          className="w-full h-full object-cover absolute inset-0 rounded-xl"
        />
      ) : isVideo ? (
        <VideoIcon />
      ) : (
        <PlanIcon />
      )}
      {!isImage && (
        <span className="text-[10px] text-slate-500 text-center leading-tight px-1 z-10">
          {name}
        </span>
      )}
      <button
        onClick={onRemove}
        className="absolute cursor-pointer top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-slate-500"
      >
        <XIcon />
      </button>
    </div>
  );
}

export function DropZone({
  label,
  sublabel,
  accept,
  multiple = false,
  icon,
  hint,
  files,
  onAdd,
  onRemove,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      onAdd(Array.from(incoming));
    },
    [onAdd]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-blue-500 font-medium">{sublabel}</p>
      </div>

      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !hasFiles && inputRef.current?.click()}
        className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[140px]
            flex flex-col items-center justify-center gap-3 px-6 py-8
            ${
              dragging
                ? "border-blue-400 bg-blue-50/60"
                : hasFiles
                ? "border-slate-200 bg-white cursor-default"
                : "border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer"
            }
          `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {hasFiles ? (
          /* Preview row */
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {files.map((uf) => (
                <FileThumb
                  key={uf.id}
                  uf={uf}
                  onRemove={() => onRemove(uf.id)}
                />
              ))}
            </div>
            {multiple && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="self-start flex items-center gap-1.5 text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
              >
                <UploadCloudIcon />
                Add more files
              </button>
            )}
          </div>
        ) : (
          /* Empty state */
          <>
            {icon}
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              {hint}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
