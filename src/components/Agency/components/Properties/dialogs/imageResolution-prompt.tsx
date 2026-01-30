'use client';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

type LowResolutionPromptProps = {
  show: boolean;
  message : string;
};

export function LowResolutionPrompt({ show, message }: LowResolutionPromptProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200">
        <div className="w-full h-full flex justify-center items-center">
        
            <Alert className="w-[80vh] h-fit mt-4 p-4">
                <ImageIcon className="h-8 w-8" />
                <AlertTitle className="text-xl mb-4">Image quality too low</AlertTitle>
                
                <AlertDescription className="leading-relaxed text-lg mb-3">
                    All images must be of High quality Resolution Quality
                    <br />
                    <strong>{message}</strong>
                    {/* The image you uploaded is too small and may appear blurry.
                    Please upload a higher resolution image for best results. */}
                </AlertDescription>
            </Alert>
        </div>
    </div>
  );
}
