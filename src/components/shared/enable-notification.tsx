"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  onClose: () => void;
  onClick: () => void;
}

export default function ActivateNotifications({ onClose, onClick }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-80">
      <Card>
        <CardContent>
          <div className="bg-white rounded-lg p-6 w-12/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Enable Push Notifications
            </h2>
            <p className="mb-6">
              <b>Turn on</b> notifications so we can instantly alert you when
              new properties match your saved searches. This helps you act fast
              on newly listed homes before there are gone.
            </p>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer bg-black text-white hover:bg-black/90 border-black"
                onClick={onClick}
              >
                Turn on
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
