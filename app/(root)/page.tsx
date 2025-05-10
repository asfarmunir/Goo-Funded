"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { accountStore } from "../store/account";
import { ChevronDown } from "lucide-react";
import AccountCheckout from "@/components/shared/AccountCheckout";

type accountTypes = "CHALLENGE" | "FUNDED" | "BREACHED";
type sortFilterType = "ALL" | "FUNDED" | "BREACHED" | "CHALLENGE";
const page = () => {
  const [tab, setTab] = React.useState("hide");
  const [sortFilter, setSortFilter] = React.useState<sortFilterType>("ALL");

  const { data, isPending } = useGetAccounts();

  const account = accountStore((state) => state.account);

  // Sort Filter
  const changeSortFilter = (sortFilter: sortFilterType) => {
    setSortFilter(sortFilter);
  };

  // Filter
  const filteredData = useMemo(() => {
    // Tab Filer
    const filteredData = data?.filter((account: any) => {
      if (tab === "show") {
        return (
          account.status === "BREACHED" ||
          account.status === "FUNDED" ||
          account.status === "CHALLENGE"
        );
      } else if (tab === "hide") {
        return account.status !== "BREACHED";
      }
      return true;
    });

    // Sort Filter
    if (sortFilter === "FUNDED") {
      return filteredData?.filter(
        (account: any) => account.status === "FUNDED"
      );
    } else if (sortFilter === "BREACHED") {
      return filteredData?.filter(
        (account: any) => account.status === "BREACHED"
      );
    } else if (sortFilter === "CHALLENGE") {
      return filteredData?.filter(
        (account: any) => account.status === "CHALLENGE"
      );
    } else {
      return filteredData;
    }
  }, [tab, data, sortFilter]);

  return (
    <>
      <div className=" w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* mobile hero  */}
          <div
            className="p-3 md:p-6 md:hidden bg-white justify-center  row-span-2 md:col-span-2  overflow-hidden relative min-h-48 2xl:min-h-44 rounded-2xl w-full  flex flex-col gap-2 "
            style={{
              backgroundImage: "url('/vintage/images/heroBg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "right",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-xl capitalize 2xl:text-2xl text-vintage-50 font-bold">
              Bet sports with our money
            </h1>

            <p className=" text-gray-700  bg-white/50 rounded-full p-2 mb-2   2xl:text-base max-w-sm 2xl:max-w-md text-sm  font-semibold">
              Maximize your earnings with minimal risk. Bet confidently using
              our capital and unlock higher rewards!{" "}
            </p>
            <Dialog>
              <DialogTrigger className=" w-fit text-sm 2xl:text-base  rounded-full bg-vintage-50 px-5 py-3 inline-flex items-center gap-3">
                <Image
                  src="/icons/video.svg"
                  alt="Arrow Icon"
                  width={13}
                  height={13}
                />
                <span className=" font-semibold text-white">How it works</span>{" "}
              </DialogTrigger>
              <DialogContent className=" bg-white gap-1 py-12  border-none md:min-w-[700px] 2xl:min-w-[900px] flex flex-col items-center">
                <h2 className=" text-3xl font-bold">How It Works</h2>
                <DialogDescription>
                  You can find more information on our help tab
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
          <div className=" p-3 md:p-6 bg-white  overflow-hidden col-span-1 md:col-span-2 relative min-h-44 2xl:min-h-44 rounded-2xl w-full  flex flex-col gap-1 ">
            <div className=" w-full flex items-center justify-between">
              <p className=" text-gray-700 mb-3  2xl:text-base text-sm ">
                Total Funded Amount
              </p>
              <Link href={"/user/profile?tab=accounts&status=funded"}>
                <Image
                  src="/vintage/images/arrow.svg"
                  alt="Arrow Icon"
                  width={50}
                  className=" absolute bottom-3 right-3"
                  height={50}
                />
              </Link>
            </div>
            <p className="     text-4xl 2xl:text-5xl font-bold">
              $
              {(account.status === "FUNDED"
                ? account.totalFundedAmount
                : 0
              )?.toFixed(2)}
            </p>
          </div>
          <div
            className="p-3 md:p-6 hidden bg-white justify-center  row-span-2 md:col-span-3  overflow-hidden relative min-h-48 2xl:min-h-44 rounded-2xl w-full  md:flex flex-col gap-2 "
            style={{
              backgroundImage: "url('/vintage/images/heroBg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "right",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-xl capitalize 2xl:text-2xl text-vintage-50 font-bold">
              Bet sports with our money
            </h1>

            <p className=" text-gray-700  bg-white/50 rounded-full p-2 mb-2   2xl:text-base max-w-sm 2xl:max-w-md text-sm  font-semibold">
              Maximize your earnings with minimal risk. Bet confidently using
              our capital and unlock higher rewards!{" "}
            </p>
            <Dialog>
              <DialogTrigger className=" w-fit text-sm 2xl:text-base  rounded-full bg-vintage-50 px-5 py-3 inline-flex items-center gap-3">
                <Image
                  src="/icons/video.svg"
                  alt="Arrow Icon"
                  width={13}
                  height={13}
                />
                <span className=" font-semibold text-white">How it works</span>{" "}
              </DialogTrigger>
              <DialogContent className=" bg-white gap-1 py-12  border-none md:min-w-[700px] 2xl:min-w-[900px] flex flex-col items-center">
                <h2 className=" text-3xl font-bold">How It Works</h2>
                <DialogDescription>
                  You can find more information on our help tab
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
          <div className=" p-3 md:p-6 bg-white col-span-1 md:col-span-2  overflow-hidden relative min-h-44 2xl:min-h-44 rounded-2xl w-full  flex flex-col gap-1 ">
            <div className=" w-full flex items-center justify-between">
              <p className=" text-gray-700  mb-3  2xl:text-base text-sm ">
                Total Payout Amount
              </p>
              <Link href={"/user/profile?tab=payouts"}>
                <Image
                  src="/vintage/images/arrow.svg"
                  alt="Arrow Icon"
                  width={50}
                  className=" absolute bottom-3 right-3"
                  height={50}
                />
              </Link>
            </div>
            <p className="   md:mt-0  text-4xl 2xl:text-5xl font-bold">
              ${account.totalFundedPayout?.toFixed(2)}
            </p>
          </div>
        </div>

        {account.id !== "" && (
          <div className=" w-full space-y-5 bg-[#F8F8F8] p-3 md:p-6 rounded-2xl ">
            <div className=" w-full flex flex-col gap-3 md:flex-row items-center  justify-between">
              <h2 className=" text-lg 2xl:text-xl text-vintage-50 font-bold">
                Account Overview
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-fit">
                {tab !== "show" ? (
                  <button
                    onClick={() => setTab("show")}
                    className="  text-vintage-50 bg-white   w-full md:w-fit text-sm font-semibold px-3.5 py-2.5 rounded-full inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/icons/check.png"
                      alt="Arrow Icon"
                      width={18}
                      height={18}
                      className=" invert"
                    />
                    SHOW BREACHED
                  </button>
                ) : (
                  <button
                    onClick={() => setTab("hide")}
                    className=" text-vintage-50 w-full bg-white md:w-fit text-sm font-semibold px-3.5 py-2.5 rounded-full inline-flex items-center justify-center gap-2"
                  >
                    <Image
                      src="/icons/hide.png"
                      alt="Arrow Icon"
                      className=" invert"
                      width={18}
                      height={18}
                    />
                    HIDE INACTIVE
                  </button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger className=" text-vintage-50  bg-white font-semibold     justify-center w-full md:w-fit  text-xs 2xl:text-base px-3.5 py-2.5 rounded-full inline-flex items-center gap-2">
                    Sort : {sortFilter} <ChevronDown className="pb-0.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48  bg-vintage-50 text-white border-none  mt-1  p-3 rounded-lg text-xs 2xl:text-base">
                    <DropdownMenuItem
                      className="flex items-center justify-between "
                      onClick={() => changeSortFilter("ALL")}
                    >
                      <p>All</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between "
                      onClick={() => changeSortFilter("CHALLENGE")}
                    >
                      <p>Challenge</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between "
                      onClick={() => changeSortFilter("FUNDED")}
                    >
                      <p>Funded</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center justify-between "
                      onClick={() => changeSortFilter("BREACHED")}
                    >
                      <p>Breached</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href="/create-account"
                  className=" bg-vintage-50 text-white outline-fuchsia-50 font-bold  rounded-full   justify-center w-full md:w-fit text-sm px-4 py-2.5  inline-flex items-center gap-2"
                >
                  <Image
                    src="/icons/add.png"
                    alt="Arrow Icon"
                    width={18}
                    height={18}
                  />
                  ADD ACCOUNT
                </Link>
              </div>
            </div>
            {!isPending && data?.length === 0 ? (
              <div className="  p-3 pb-8 md:p-7  overflow-hidden relative  rounded-2xl w-full  flex flex-col items-center justify-center gap-1 ">
                <p className="  mb-3 mt-4 md:mt-0 2xl:text-lg font-semibold">
                  No Accounts Found
                </p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isPending ? (
                <div className=" col-span-2 flex items-center justify-between ">
                  Loading...
                </div>
              ) : filteredData.length === 0 ? (
                <>
                  <div className="  col-span-2 p-3 pb-8 md:p-7  overflow-hidden relative  rounded-2xl w-full  flex flex-col items-center justify-center gap-1 ">
                    <p className=" text-vintage-50 mb-3 mt-4 md:mt-0 2xl:text-lg font-semibold">
                      No {sortFilter.toLowerCase()} accounts found. Make sure
                      you have set filters properly.
                    </p>
                  </div>
                </>
              ) : (
                filteredData?.map((account: any, index: number) => (
                  <Link
                    key={index}
                    className="   overflow-hidden relative  bg-white p-2 md:p-6 rounded-xl shadow-sm  w-full  flex flex-col gap-1 "
                    href={`/dashboard?account=${account.id}`}
                  >
                    <div className=" w-full flex items-center mb-3 justify-between">
                      <p className=" text-vintage-50   2xl:text-xl text-lg font-semibold">
                        ${account.accountSize.replace("K", "000")}
                      </p>
                      <p
                        className={` px-8 py-2.5 2xl:py-3 text-xs 2xl:text-sm font-bold rounded-full 
                  ${
                    account.status === "FUNDED"
                      ? "  bg-[#0F840C1F] text-green-700 border border-[#0F840C3D] "
                      : account.status === "BREACHED"
                      ? " bg-[#FF00001F] text-[#ff0000cf] border border-[#FF00003D] "
                      : " bg-[#C02FF51F] text-[#c02ff5ad] border border-[#C02FF53D]  "
                  }
             
              `}
                      >
                        {account.status}
                      </p>
                    </div>
                    <div className=" w-full flex justify-between items-center gap-2 md:gap-4">
                      <div className=" w-full p-7 rounded-lg  bg-[#F8F8F8] flex flex-col-reverse items-center justify-between">
                        <p className=" text-xs md:text-sm text-center text-[#848697]   md:mt-1 2xl:text-lg ">
                          Account Balance
                        </p>
                        <p className=" text-vintage-50 mb-1 mt-4   md:mt-0 2xl:text-2xl text-xs md:text-xl font-semibold">
                          ${account.balance}
                        </p>
                      </div>
                      <div className=" w-full p-7 rounded-lg  bg-[#F8F8F8] flex flex-col-reverse items-center justify-between">
                        <p className=" text-xs md:text-sm text-center text-[#848697]   md:mt-1 2xl:text-lg ">
                          Account Number
                        </p>
                        <p className=" text-vintage-50 mb-1 truncate mt-4 text-xs  md:mt-0 2xl:text-2xl md:text-xl font-semibold">
                          #{account.accountNumber}
                        </p>
                      </div>{" "}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        <div className=" w-full h-ull bg-white py-6 px-2 md:p-8 min-h-96 flex flex-col gap-1 items-center justify-center  rounded-2xl 2xl:p-6">
          <Image
            src="/vintage/images/createAccount.svg"
            alt="Hero Image"
            width={60}
            height={60}
            className=" mb-4"
          />
          <h2 className=" text-xl font-bold text-wrap ">
            Create a new account
          </h2>
          <p className=" text-gray-700 mb-4 text-sm px-3 2xl:text-base leading-snug text-center">
            Maximize your earnings with minimal risk. Bet confidently using our
            capital and unlock higher rewards!{" "}
          </p>

          <Link
            href={"/create-account"}
            className=" inline-flex items-center py-2.5 px-6 rounded-full bg-vintage-50"
          >
            <span className="ml-2 text-white">Add Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
