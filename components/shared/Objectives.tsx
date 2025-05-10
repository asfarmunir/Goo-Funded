"use client";
import { useGetAccount } from "@/app/hooks/useGetAccount";
import { accountStore } from "@/app/store/account";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import { getOriginalAccountValue, getPercentageTimePassed } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Objectives = () => {
  const accountId = accountStore((state) => state.account.id);

  const {
    data: account,
    isPending,
    isError,
    refetch,
  } = useGetAccount(accountId);
  useEffect(() => {
    refetch();
  }, [accountId]);

  // States to store the countdowns
  const [minBetCountdown, setMinBetCountdown] = useState("");
  const [maxBetCountdown, setMaxBetCountdown] = useState("");

  useEffect(() => {
    if (!account) return;

    // Helper function to calculate the time remaining in a readable format
    const calculateCountdown = (endDate: Date) => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance <= 0) return "0D 0H 0M 0S"; // If time has passed

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${days}D ${hours}H ${minutes}M ${seconds}S`;
    };

    // Update countdown every second
    const interval = setInterval(() => {
      setMinBetCountdown(calculateCountdown(new Date(account.minBetPeriod)));
      setMaxBetCountdown(calculateCountdown(new Date(account.maxBetPeriod)));
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [account]);

  if (isError) {
    toast.error("Error fetching account stats");
    return (
      <div className="w-full h-44 flex justify-center items-center bg-[#F4F4F4] rounded-lg">
        <p className=" font-semibold">Error fetching account stats</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full h-44 flex justify-center items-center bg-[#F4F4F4] rounded-lg">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="w-full h-44 flex justify-center items-center bg-[#F4F4F4] rounded-lg">
        <p className="">Account not found</p>
      </div>
    );
  }

  return (
    <div className=" w-full space-y-4 bg-white p-4 md:p-6 rounded-2xl ">
      <div className="w-full flex-col md:flex-row  bg-[#F4F4F4] p-3 rounded-lg flex items-center justify-between gap-4">
        <h3 className="text-lg 2xl:text-xl  font-bold flex items-center gap-1.5">
          ${account.accountSize.replace("K", "000")}
          <span className=" text-primary-700 text-sm">Account</span>
        </h3>
        <div className="flex w-full md:w-fit items-center gap-2 flex-col md:flex-row">
          <button className="flex justify-center items-center gap-2 px-4  text-xs w-full md:w-fit 2xl:text-base  ">
            <Image
              src="/icons/calender.svg"
              alt="Arrow Icon"
              width={20}
              className=" invert mb-0.5"
              height={20}
            />
            <span className="text-primary-700 ">Start Date:</span>
            {new Date(account.createdAt).toLocaleDateString()}
          </button>
          <button className="flex justify-center text-vintage-50  items-center gap-2 px-4 py-2 text-xs w-full md:w-fit 2xl:text-base font-semibold  bg-[#001E451A] rounded-lg">
            {(() => {
              const totalPhases = account.accountType === "TWO_STEP" ? 2 : 3;
              if (account.phase < totalPhases)
                return `PHASE ${account.phase} / ${totalPhases}`;
              return "FUNDED";
            })()}
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                $
                {account.balance - getOriginalAccountValue(account) < 0
                  ? 0
                  : (
                      account.balance - getOriginalAccountValue(account)
                    ).toFixed(2)}{" "}
                / $
                {getOriginalAccountValue(account) *
                  ALL_STEP_CHALLENGES.profitTarget}{" "}
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                Profit Target
              </span>
              <p className=" text-green-600 font-thin text-sm">
                {(account.balance - getOriginalAccountValue(account) < 0
                  ? 0
                  : (account.balance - getOriginalAccountValue(account)) /
                      (getOriginalAccountValue(account) *
                        ALL_STEP_CHALLENGES.profitTarget) >
                    1
                  ? 100
                  : ((account.balance - getOriginalAccountValue(account)) /
                      (getOriginalAccountValue(account) *
                        ALL_STEP_CHALLENGES.profitTarget)) *
                    100
                ).toFixed(2)}{" "}
                %
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#0F840C]  "
                style={{
                  width: `${
                    account.balance - getOriginalAccountValue(account) < 0
                      ? 0
                      : (account.balance - getOriginalAccountValue(account)) /
                          (getOriginalAccountValue(account) *
                            ALL_STEP_CHALLENGES.profitTarget) >
                        1
                      ? 100
                      : ((account.balance - getOriginalAccountValue(account)) /
                          (getOriginalAccountValue(account) *
                            ALL_STEP_CHALLENGES.profitTarget)) *
                        100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div> */}
        {account.status !== "FUNDED" && (
          <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
            <div className="flex items-start gap-2.5">
              <div className="  font-bold flex flex-col  gap-1">
                <p className=" text-lg textvin 2xl:text-xl ">
                  $
                  {account.balance - getOriginalAccountValue(account) < 0
                    ? 0
                    : (
                        account.balance - getOriginalAccountValue(account)
                      ).toFixed(2)}{" "}
                  / $
                  {getOriginalAccountValue(account) *
                    ALL_STEP_CHALLENGES.profitTarget}{" "}
                </p>
              </div>
            </div>
            <div className=" w-full flex flex-col items-end gap-4">
              <div className=" w-full flex flex-col items-end gap-4">
                <div className="flex items-center justify-between w-full">
                  <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                    Profit Target
                  </span>
                  <p className=" text-green-600 font-thin text-sm">
                    {(account.balance - getOriginalAccountValue(account) < 0
                      ? 0
                      : (account.balance - getOriginalAccountValue(account)) /
                          (getOriginalAccountValue(account) *
                            ALL_STEP_CHALLENGES.profitTarget) >
                        1
                      ? 100
                      : ((account.balance - getOriginalAccountValue(account)) /
                          (getOriginalAccountValue(account) *
                            ALL_STEP_CHALLENGES.profitTarget)) *
                        100
                    ).toFixed(2)}
                    %
                  </p>
                </div>

                <div className=" w-full h-2 bg-slate-200  border-gray-400">
                  <div
                    className="h-full bg-[#0F840C]  "
                    style={{
                      width: `${
                        account.balance - getOriginalAccountValue(account) < 0
                          ? 0
                          : (account.balance -
                              getOriginalAccountValue(account)) /
                              (getOriginalAccountValue(account) *
                                ALL_STEP_CHALLENGES.profitTarget) >
                            1
                          ? 100
                          : ((account.balance -
                              getOriginalAccountValue(account)) /
                              (getOriginalAccountValue(account) *
                                ALL_STEP_CHALLENGES.profitTarget)) *
                            100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                -${account.dailyLoss || 0} / -$
                {(
                  getOriginalAccountValue(account) *
                  ALL_STEP_CHALLENGES.maxDailyLoss
                ).toFixed(2)}
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                Maximum daily loss
              </span>
              <p className=" text-red-600 font-thin text-sm">
                {(
                  (account.dailyLoss / getOriginalAccountValue(account)) *
                  100
                ).toFixed(2)}
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#C41718]   "
                style={{
                  width: `${
                    (account.dailyLoss / getOriginalAccountValue(account)) *
                      100 >
                    100
                      ? 100
                      : (account.dailyLoss / getOriginalAccountValue(account)) *
                        100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                -${account.totalLoss} / -$
                {(
                  getOriginalAccountValue(account) * ALL_STEP_CHALLENGES.maxLoss
                ).toFixed(2)}{" "}
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                Maximum loss
              </span>
              <p className=" text-red-600 font-thin text-sm">
                {(account.totalLoss / getOriginalAccountValue(account)) * 100 >
                100
                  ? 100
                  : (
                      (account.totalLoss / getOriginalAccountValue(account)) *
                      100
                    ).toFixed(2)}
                %
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#C41718]   "
                style={{
                  width: `${
                    (account.totalLoss / getOriginalAccountValue(account)) *
                      100 >
                    100
                      ? 100
                      : (account.totalLoss / getOriginalAccountValue(account)) *
                        100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                {account.picks}/{ALL_STEP_CHALLENGES.minPicks}
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs capitalize 2xl:text-base text-slate-500  font-normal text-primary-700">
                Minimum number of picks
              </span>
              <p className=" text-green-600 font-thin text-sm">
                {(account.picks / ALL_STEP_CHALLENGES.minPicks) * 100 > 100
                  ? 100
                  : (
                      (account.picks / ALL_STEP_CHALLENGES.minPicks) *
                      100
                    ).toFixed(2)}
                %
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#0F840C]   "
                style={{
                  width: `${
                    (account.picks / ALL_STEP_CHALLENGES.minPicks) * 100 > 100
                      ? 100
                      : (account.picks / ALL_STEP_CHALLENGES.minPicks) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                {account.minBetPeriod ? minBetCountdown : `0 Days`} Remaining
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                Minimum Bet Period
              </span>
              <p className=" text-green-600 font-thin text-sm">
                {getPercentageTimePassed(
                  new Date(account.createdAt),
                  new Date(account.minBetPeriod)
                ).toFixed(2)}
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#0F840C]   "
                style={{
                  width: `${getPercentageTimePassed(
                    new Date(account.createdAt),
                    new Date(account.minBetPeriod)
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full flex-col bg-[#F4F4F4] rounded-lg p-5    flex items-starth gap-4">
          <div className="flex items-start gap-2.5">
            <div className="  font-bold flex flex-col  gap-1">
              <p className=" text-lg textvin 2xl:text-xl ">
                {account.accountType !== "FUNDED" ? maxBetCountdown : `0 Days`}{" "}
              </p>
            </div>
          </div>
          <div className=" w-full flex flex-col items-end gap-4">
            <div className="flex items-center justify-between w-full">
              <span className=" text-xs 2xl:text-base text-slate-500  font-normal text-primary-700">
                Time Remaining
              </span>
              <p className=" text-green-600 font-thin text-sm">
                {getPercentageTimePassed(
                  new Date(account.createdAt),
                  new Date(account.maxBetPeriod)
                ).toFixed(2)}
              </p>
            </div>

            <div className=" w-full h-2 bg-slate-200  border-gray-400">
              <div
                className="h-full bg-[#0F840C]   "
                style={{
                  width: `${getPercentageTimePassed(
                    new Date(account.createdAt),
                    new Date(account.maxBetPeriod)
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objectives;
