"use client";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaAngleDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import { MdOutlineArrowUpward } from "react-icons/md";
import { TbMessageCircleSearch } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { useGetLeaderboard } from "@/app/hooks/useGetLeaderboard";
import { getCountryCode } from "countries-list";
import ReactCountryFlag from "react-country-flag";
import { profileLevels } from "@/lib/constants";
import Link from "next/link";

// type profileLevelName =
//   | "NEWBIE"
//   | "BRONZE"
//   | "SILVER"
//   | "GOLD"
//   | "PLATINUM"
//   | "HERO";

type profileLevelName =
  | "Beginner"
  | "Superviser"
  | "Coach"
  | "TopTier"
  | "RegionalPlayer";

const page = () => {
  const { data, isPending: loading } = useGetLeaderboard();
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"TOP" | "BOTTOM" | "AVERAGE">("TOP");
  // pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(data?.leaderboard.length / PER_PAGE);

  const goToNextPage = () => {
    if (page === TOTAL_PAGES) return;
    setPage((page) => page + 1);
  };

  const goToPrevPage = () => {
    if (page === 1) return;
    setPage((page) => page - 1);
  };

  const filteredData = useMemo(() => {
    if (loading) return [];

    const searchFiltered = data?.leaderboard.filter((account: any) =>
      `${account.user?.firstName} ${account.user?.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const sortedData = searchFiltered?.sort((a: any, b: any) => {
      if (sort === "TOP") {
        return a.totalFundedAmount > b.totalFundedAmount ? -1 : 1;
      } else if (sort === "BOTTOM") {
        return a.totalFundedAmount < b.totalFundedAmount ? -1 : 1;
      } else {
        return 0;
      }
    });

    const pagedData = sortedData?.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return pagedData;
  }, [data, search, sort, page]);

  return (
    <>
      <div className=" w-full  rounded-2xl flex flex-col-reverse  bg-vintage-50  text-white   gap-4 p-2 md:p-3   max-h-full overflow-auto">
        {loading ? (
          <div className=" w-full   h-full  bg-white flex flex-col items-center justify-center gap-3 py-12 min-h-[50svh]   p-4 md:p-8 rounded-xl">
            <Image
              src="/images/trophy.png"
              alt="loading"
              width={50}
              className=" invert mb-4"
              height={50}
            />
            <h3 className=" font-bold text-lg 2xl:text-xl text-[#3E4347]">
              Leaderboards coming soon....
            </h3>
            <p className=" text-sm text-[#3E4347] px-3">
              Maximize your earnings with minimal risk. Bet confidently using
              our capital and unlock higher rewards!
            </p>
          </div>
        ) : (
          <div className=" w-full  bg-white rounded-xl p-5  flex flex-col">
            {/* <div className="flex items-center gap-3 w-full p-2 md:p-6 md:pr-32 ">
              <DropdownMenu>
                <DropdownMenuTrigger className=" bg-[#393C53]    justify-center text-nowrap w-fit  text-xs md:text-sm px-3 md:px-4 py-3 font-bold rounded-lg inline-flex items-center gap-2">
                  {sort} EARNERS
                  <FaAngleDown className=" text-lg" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48  bg-[#181926] text-white border-none  mt-1  p-3 rounded-lg shadow-sm">
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() => setSort("TOP")}
                  >
                    <p>TOP EARNERS</p>

                    <MdOutlineArrowUpward className="text-lg" />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center justify-between "
                    onClick={() => setSort("AVERAGE")}
                  >
                    <p>AVERAGE</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between "
                    onClick={() => setSort("BOTTOM")}
                  >
                    <p>BOTTOM EARNERS</p>
                    <MdOutlineArrowUpward className="text-lg rotate-180" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
              <div className=" bg-[#333547]/60 inline-flex md:flex-grow items-center py-1 px-2 rounded-lg">
                <LuSearch className="w-7 h-7 text-[#848BAC] " />
                <Input
                  className=" bg-transparent text-white focus:outline-0 focus:ring-0 focus:border-none placeholder-slate-900  capitalize"
                  placeholder={"search..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div> */}

            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className=" bg-[#F8F8F8]  border-none">
                <TableRow className=" border-none">
                  <TableHead className=" capitalize  font-bold text-start">
                    position
                  </TableHead>
                  <TableHead className=" capitalize font-bold text-start">
                    name
                  </TableHead>
                  <TableHead className=" capitalize font-bold text-center">
                    level
                  </TableHead>
                  <TableHead className=" capitalize font-bold text-center">
                    country
                  </TableHead>
                  <TableHead className=" capitalize font-bold text-center">
                    earnings
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className=" ">
                {!loading && filteredData?.length === 0 && (
                  <TableRow className="border-none">
                    <TableCell className="text-center" colSpan={5}>
                      <h2 className="text-gray-700 tracking-wide capitalize font-semibold">
                        No data available
                      </h2>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  filteredData?.map((account: any, index: number) => (
                    <TableRow className="text-black" key={account.userId}>
                      {/* <TableRow className=""> */}
                      <TableCell className="   py-5 border-b border-gray-700 ">
                        <p
                          className={`
                        w-8 ml-4 h-8 rounded-full 
                        font-bold text-xs 2xl:text-base text-center flex items-center justify-center

                        ${
                          account.rank === 1
                            ? " bg-yellow-400 text-black shadow-inner shadow-slate-400"
                            : account.rank === 2
                              ? " bg-gray-400 text-black shadow-inner shadow-slate-400"
                              : account.rank === 3
                                ? " bg-[#cd7f32] text-white shadow-inner shadow-slate-400"
                                : " "
                        }
                          
                          
                          `}
                        >
                          {account.rank}
                        </p>
                      </TableCell>

                      <TableCell className="   font-bold  capitalize text-xs py-5 border-b border-gray-700 2xl:text-base   ">
                        <div className="flex items-center  gap-2">
                          <Image
                            src="/vintage/images/avatar.svg"
                            alt="profile"
                            width={25}
                            height={25}
                          />
                          {`${account.user?.firstName} ${account.user?.lastName}`}
                          {/* Asfar Munir */}
                        </div>
                      </TableCell>
                      <TableCell className="    py-5 border-b border-gray-700 ">
                        <div className=" 2xl:text-base mx-auto flex justify-center mt-0.5 ">
                          <Image
                            src={
                              profileLevels[
                                account?.user?.profileLevel as profileLevelName
                              ]?.icon
                            }
                            alt="profile"
                            width={25}
                            height={25}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="   font-bold capitalize text-xs py-5 border-b border-gray-700 2xl:text-base  ">
                        <div className="flex justify-center">
                          <ReactCountryFlag
                            countryCode={
                              getCountryCode(account.user.country) as string
                              // getCountryCode("US") as string
                            }
                            svg
                            style={{
                              width: "25px",
                              height: "25px",
                            }}
                            className="rounded-full object-cover"
                            // title={account.user.country}
                            title="USA"
                          />
                        </div>
                      </TableCell>

                      <TableCell className=" font-bold  capitalize text-black text-xs py-5 border-b border-gray-700 2xl:text-base text-center truncate">
                        ${account.totalFundedAmount}
                        {/* $1000 */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-5">
              <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base ">
                PAGE {page} OF {TOTAL_PAGES}
              </h4>
              <div className="flex gap-2 items-center">
                <button
                  className="text-[#848BAC] text-2xl"
                  onClick={goToPrevPage}
                >
                  <TiArrowLeft />
                </button>
                <button className="text-black text-2xl" onClick={goToNextPage}>
                  <TiArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className=" w-full  bg-blue-900 px-5 py-10 h-[23rem]  flex flex-col md:flex-row items-center md:items-end justify-between  gap-2.5 rounded-xl   relative"
          style={{
            backgroundImage: "url('/vintage/images/bgCom.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className=" flex flex-col items-center md:items-start gap-2">
            <h2 className="font-bold text-xl 2xl:text-2xl">
              Stay in the Game with Us
            </h2>
            <p className=" text-sm 2xl:text-base text-center text-white mb-4">
              Follow our social channels for exclusive tips, news, and offers.
            </p>
            <Link
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              className="text-center  py-4 w-fit text-sm rounded-full bg-vintage-50  px-6 font-bold"
            >
              JOIN DISCORD
            </Link>
          </div>
          <div className=" flex items-center  gap-3">
            <Image
              src="/vintage/images/discord.svg"
              alt="Logo"
              width={140}
              className=" w-[80px] md:w-[145px] "
              height={140}
            />
            <Image
              src="/vintage/images/youtube.svg"
              alt="Logo"
              width={140}
              className=" w-[80px] md:w-[145px] "
              height={140}
            />
            <Image
              src="/vintage/images/instagram.svg"
              alt="Logo"
              width={150}
              className=" w-[80px] md:w-[145px] "
              height={150}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
