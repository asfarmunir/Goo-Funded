"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { usePostReferPayout } from "@/app/hooks/usePostReferPayout";
import { toast } from "react-hot-toast";

// Define TypeScript enum for Currency
enum Currency {
  USDT = "USDT ERC20",
  ETH = "ETH ERC20",
}

// Define the Zod schema for validation
const payoutSchema = z.object({
  currency: z.enum([Currency.USDT, Currency.ETH], {
    required_error: "Please select a currency",
  }),
  networkAddress: z
    .string()
    .nonempty("Network address is required")
    .min(5, "Network address must be at least 5 characters long"),
});

type PayoutFormInputs = z.infer<typeof payoutSchema>;

export default function PayoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PayoutFormInputs>({
    resolver: zodResolver(payoutSchema),
  });

  const { mutate: requestPayout, isPending } = usePostReferPayout({
    onSuccess: () => {
      toast.success("Payout request submitted successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit payout request");
    },
  });

  const onSubmit = async (data: PayoutFormInputs) => {
    if (errors.currency || errors.networkAddress) return;

    const payoutReqData = {
      currency: data.currency === Currency.USDT ? "USDT_ERC20" : "ETH_ERC20",
      networkAddress: data.networkAddress,
    };

    await requestPayout(payoutReqData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" bg-white gap-1 p-6 text-vintage-50 md:rounded-3xl overflow-hidden border-none">
        <DialogTitle className=" bg-white text-vintage-50 2xl:text-lg border-none mb-8">
          Request Affiliate Payout
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Crypto Currency Selection */}
          <div>
            <label htmlFor="currency" className="text-sm">
              Crypto Currency
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`bg-[#F8F8F8] py-3 border border-[#001E451A] border-opacity-10 w-full text-left p-2 rounded-xl text-sm ${
                  selectedCurrency ? "text-vintage-50" : "text-vintage-50/40"
                } ${errors.currency ? "border-red-500" : ""}`}
              >
                {selectedCurrency ? selectedCurrency : "Select Currency"}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                id="currency"
                className=" bg-white text-vintage-50 border-[#001E451A]/20"
              >
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedCurrency(Currency.USDT);
                    setValue("currency", Currency.USDT);
                  }}
                >
                  {Currency.USDT}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedCurrency(Currency.ETH);
                    setValue("currency", Currency.ETH);
                  }}
                >
                  {Currency.ETH}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currency.message}
              </p>
            )}
          </div>

          {/* Network Address Input */}
          <div>
            <label htmlFor="network-address" className="text-sm">
              Network Address
            </label>
            <Input
              id="network-address"
              placeholder="Enter Network Address"
              className={`bg-[#F8F8F8] py-6 rounded-xl text-vintage-50 border border-[#001E451A] border-opacity-10 ${
                errors.networkAddress ? "border-red-500" : ""
              }`}
              {...register("networkAddress")}
            />
            {errors.networkAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.networkAddress.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-end gap-4 pt-4">
            <button
              type="button"
              className="bg-[#001E451A] font-semibold  2xl:text-sm  text-xs  p-3 rounded-full px-8 border border-[#001E451A]"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="p-3 px-8 2xl:text-sm font-semibold text-xs text-white rounded-full bg-vintage-50 disabled:opacity-20"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Request Payout"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
