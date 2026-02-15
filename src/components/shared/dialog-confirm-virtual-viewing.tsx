import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";

interface ConfirmVirtualViewingProps {
  isOpen: boolean;
  virtualViewingFee: any;
  onClose: () => void;
  onProceed: () => void;
}

export const ConfirmVirtualViewing = ({
  virtualViewingFee,
  isOpen,
  onClose,
  onProceed,
}: ConfirmVirtualViewingProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-yellow-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3"></DialogTitle>
          <DialogDescription>
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 space-y-4 max-w-md">
              <div>
                <p className="text-sm text-gray-600">Virtual Viewing Fee</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₦{Number(virtualViewingFee.fee).toLocaleString("en-US")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This fee covers the scheduled virtual tour session.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="cursor-pointer flex-1 border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-100 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="cursor-pointer flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
                  onClick={onProceed}
                >
                  Proceed
                </button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
