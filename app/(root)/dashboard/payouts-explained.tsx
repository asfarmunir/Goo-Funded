import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";

export default function PayoutsExplained({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogTitle hidden>Payouts Explained</DialogTitle>
      <DialogContent className="bg-vintage-50 border-none text-white w-5/6 sm:w-full max-w-lg">
        <h1 className="uppercase font-semibold text-lg">
          Payouts request timer
        </h1>
        <p className="text-gray-400">
          The payout request timer is 14 days. This means that you can request a
          payout every 14 days.
        </p>
      </DialogContent>
    </Dialog>
  );
}
