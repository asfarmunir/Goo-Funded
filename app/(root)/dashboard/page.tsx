"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useGetAccountStats } from "@/app/hooks/useGetAccountStats";
import { accountStore } from "@/app/store/account";
import AccountGraph from "@/components/shared/AccountGraph";
import BetHistory from "@/components/shared/BetHistory";
import Objectives from "@/components/shared/Objectives";
import { dashboardTabs } from "@/lib/constants";
import { getOriginalAccountValue } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import PayoutsExplained from "./payouts-explained";
const page = () => {
  // ACCOUNT
  const account = accountStore((state) => state.account);

  // TABS
  const [tab, setTab] = React.useState("stats");
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  // Payout Explained Modal
  const [open, setOpen] = useState(false);
  const openExplanation = () => {
    setOpen(true);
  };

  // Graph Filter
  const [filter, setFilter] = useState<"1M" | "7D" | "3M" | "24H">("1M");
  const changeFilter = (filter: "1M" | "7D" | "3M" | "24H") => {
    setFilter(filter);
  };

  return (
    <>
      <PayoutsExplained open={open} setOpen={setOpen} />

      <div className=" w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-2 2xl:space-y-3">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-4 md:p-6 rounded-2xl">
          <div>
            <h2 className="text-lg 2xl:text-xl text-vintage-50 font-bold">
              Account Dashboard
            </h2>
            <p className="text-sm">Track performance and review your data</p>
          </div>
          <div className="flex w-full md:w-fit items-center gap-2 flex-col md:flex-row">
            <button
              className="text-vintage-50 px-4  text-sm w-full md:w-fit 2xl:text-base font-semibold  "
              onClick={openExplanation}
            >
              Payout Explained
            </button>
            <Link
              href={"/user/profile?tab=payouts"}
              className="flex text-white justify-center  items-center gap-2 px-4 py-3 text-sm w-full md:w-fit 2xl:text-base font-semibold bg-vintage-50 rounded-full"
            >
              Request Payout
            </Link>
          </div>
        </div>
        <div className=" w-full grid grid-cols-1 md:grid-cols-5 gap-2">
          <div
            className=" min-h-96 flex items-center bg-vintage-50  md:col-span-2 flex-col justify-center gap-4 rounded-2xl"
            style={{
              backgroundImage: "url('/vintage/images/dashboardBg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <p className=" font-semibold text-white">Total Balance</p>
            <h2 className=" text-4xl 2xl:text-5xl font-bold text-white">
              ${account.balance.toLocaleString()}
            </h2>
          </div>
          <div className=" bg-white rounded-2xl md:col-span-3 p-4 md:p-6 ">
            <div className=" w-full flex flex-col md:flex-row gap-3 items-start justify-between pb-2 ">
              <div className="flex flex-col gap-1">
                <p className=" font-bold 2xl:text-lg  text-vintage-50">
                  Account overview
                </p>
                <p className="  text-xs max-w-[18rem] hidden 2xl:block  text-primary-600 ">
                  provides a summarized view of an account's key details and
                  activities.
                </p>
              </div>{" "}
              <div className="flex items-center 2xl:items-start gap-3 ">
                <div className="flex items-center gap-2.5 ">
                  <p className="   text-xs 2xl:text-sm text-primary-700">
                    Profit
                  </p>
                  <h2 className=" text-sm 2xl:text-lg font-semibold ">
                    $
                    {account.balance - getOriginalAccountValue(account) < 0
                      ? "0"
                      : (
                          account.balance - getOriginalAccountValue(account)
                        ).toFixed(1)}
                  </h2>
                </div>{" "}
                <div className="flex gap-2.5 items-center ">
                  <p className="   text-xs 2xl:text-sm text-primary-700">
                    Returns:
                  </p>
                  <h2 className="  bg-[#1CC0531A] p-1  px-2.5 rounded-full text-sm text-green-600 font-semibold  gap-2 inline-flex items-center ">
                    {account.balance - getOriginalAccountValue(account) < 0
                      ? 0
                      : (
                          (Math.abs(
                            account.balance - getOriginalAccountValue(account)
                          ) /
                            getOriginalAccountValue(account)) *
                          100
                        ).toFixed(1)}
                    %
                    <Image
                      src="/icons/retrun.svg"
                      alt="Arrow Icon"
                      width={23}
                      height={23}
                    />
                  </h2>
                </div>{" "}
              </div>
              <div className="flex w-full md:w-fit justify-center items-center text-xs  rounded-full  px-0.5 py-0.5 border ">
                <span
                  className={`px-2 flex-grow text-center  py-0.5 font-semibold   ${
                    filter === "24H" && "border rounded-full "
                  }`}
                  role="button"
                  onClick={() => changeFilter("24H")}
                >
                  24 h
                </span>
                <span
                  className={`px-2 flex-grow text-center  py-0.5 font-semibold   ${
                    filter === "7D" && "border rounded-full "
                  }`}
                  onClick={() => changeFilter("7D")}
                  role="button"
                >
                  7d
                </span>
                <span
                  className={`px-2 flex-grow text-center  py-0.5 font-semibold   ${
                    filter === "1M" && "border rounded-full "
                  }`}
                  onClick={() => changeFilter("1M")}
                  role="button"
                >
                  1 m
                </span>
                <span
                  className={`px-2 flex-grow text-center  py-0.5 font-semibold  ${
                    filter === "3M" && "border rounded-full "
                  }`}
                  onClick={() => changeFilter("3M")}
                  role="button"
                >
                  3 m
                </span>
              </div>
            </div>
            <div className="p-1 ">
              <AccountGraph filter={filter} />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 rounded-2xl bg-white">
          <div className="flex items-center justify-evenly md:justify-start flex-wrap gap-2 ">
            {dashboardTabs.map((curr, index) => (
              <button
                key={index}
                className={`  
             text-xs 2xl:text-base py-2.5  w-full md:w-fit text-center  flex-grow md:flex-grow-0 rounded-full ${
               tab === curr.tab
                 ? "border-[#0a0a202c] border  px-6 bg-[#0A0A201A]"
                 : " bg-transparent  px-3 capitalize"
             } font-semibold `}
                onClick={() => changeTab(curr.tab)}
              >
                {curr.title}
              </button>
            ))}
          </div>
          <Link
            href={"/picks"}
            className=" px-7 py-2.5 font-semibold text-white text-center text-sm w-full md:w-fit 2xl:text-base  rounded-full bg-vintage-50 "
          >
            Place Pick
          </Link>
        </div>
        {
          {
            stats: <Stats />,
            history: <BetHistory />,
            objectives: <Objectives />,
          }[tab]
        }
      </div>
    </>
  );
};

export default page;

const Stats = () => {
  const account = accountStore((state) => state.account);
  const {
    data: accountStats,
    isPending,
    isError,
    refetch,
  } = useGetAccountStats({ accountId: account.id });

  useEffect(() => {
    refetch();
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

  return (
    <div className=" w-full grid bg-white p-4 md:p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
      {accountStats.map((stat: any, index: number) => (
        <div
          key={index}
          className=" bg-[#F4F4F4]   rounded-lg  p-5 flex flex-col gap-1"
        >
          <h2 className="text-3xl 2xl:text-4xl font-bold text-vintage-50 ">
            {stat.value}
          </h2>
          <p className=" text-gray-700 text-xs 2xl:text-sm ">{stat.title}</p>
        </div>
      ))}
    </div>
  );
};
