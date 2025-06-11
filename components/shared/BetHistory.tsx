"use client";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import Image from "next/image";
import { useGetBets } from "@/app/hooks/useGetBets";
import { useGetResults } from "@/app/hooks/useGetResults";
import { useUpgradeAccount } from "@/app/hooks/useUpgradeAccount";
import { accountStore } from "@/app/store/account";

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  // format in the form "May 29, 23:26"
  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BetHistory = () => {
  const account = accountStore((state) => state.account);
  const accountNumber = accountStore((state) => state.account.accountNumber);

  const { data: betsData, isPending, refetch } = useGetBets(accountNumber);
  const { data, refetch: checkAndUpgradeObjectives } = useUpgradeAccount();

  // Tab Switching
  const [tab, setTab] = useState<"OPEN" | "CLOSE">("OPEN");
  const changeTab = (selectedTab: "OPEN" | "CLOSE") => {
    setTab(selectedTab);
    setCurrentPage(1); // Reset to first page on tab change
  };

  // Sorting by bet date
  const [sortFilter, setSortFilter] = useState<
    "LAST_7_DAYS" | "LAST_14_DAYS" | "LAST_30_DAYS"
  >("LAST_7_DAYS");
  const sortBets = (
    filter: "LAST_7_DAYS" | "LAST_14_DAYS" | "LAST_30_DAYS"
  ) => {
    setSortFilter(filter);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Derived state: Filtered Bets based on Tab and Sort Filter
  const filteredBets = useMemo(() => {
    if (!betsData) return;

    let filtered = betsData.filter((bet: any) =>
      tab === "OPEN" ? bet.betStatus === "OPENED" : bet.betStatus === "CLOSED"
    );

    const currentDate = new Date();

    switch (sortFilter) {
      case "LAST_7_DAYS":
        filtered = filtered.filter((bet: any) => {
          const betDate = new Date(bet.betDate);
          const diffTime = currentDate.getTime() - betDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
        break;
      case "LAST_14_DAYS":
        filtered = filtered.filter((bet: any) => {
          const betDate = new Date(bet.betDate);
          const diffTime = currentDate.getTime() - betDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 14;
        });
        break;
      case "LAST_30_DAYS":
        filtered = filtered.filter((bet: any) => {
          const betDate = new Date(bet.betDate);
          const diffTime = currentDate.getTime() - betDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 30;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [betsData, tab, sortFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const betsPerPage = 5; // Adjust as needed

  const totalPages = useMemo(
    () => Math.ceil(filteredBets?.length / betsPerPage),
    [filteredBets?.length, betsPerPage]
  );

  const currentBets = useMemo(() => {
    const start = (currentPage - 1) * betsPerPage;
    const end = start + betsPerPage;
    return filteredBets?.slice(start, end);
  }, [filteredBets, currentPage, betsPerPage]);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Web Socket
  const [updates, setUpdates] = useState([{}]);
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8443?user=${account.userId}`);

    // When connection is established
    socket.onopen = () => {
      console.log("WebSocket connection established");
      socket.send("Hello from the client!");
    };

    // When a message is received
    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    // When connection is closed
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // When there's an error
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      const newUpdates = event.data;
      console.log("NEW UPDATES FROM WS::: ", newUpdates);
      if (Array.isArray(newUpdates)) {
        setUpdates(newUpdates);
        checkAndUpgradeObjectives();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    refetch();
  }, [updates, accountNumber]);

  return (
    <div className=" w-full space-y-4 bg-[#F9F9F9] p-4 md:p-6 rounded-2xl ">
      <div className="flex items-center gap-2 w-full border p-2 rounded-2xl bg-[#F4F4F4]">
        <button
          className={`  
             px-6 text-xs 2xl:text-lg py-2 flex w-full  justify-center  items-center flex-grow md:flex-grow-0 rounded-xl ${
               tab === "OPEN"
                 ? "text-slate-700 bg-[#001E451A]"
                 : "  text-[#6a6f89] "
             } font-semibold `}
          onClick={() => changeTab("OPEN")}
        >
          Open
        </button>
        <button
          className={`  
             px-6 text-xs 2xl:text-lg py-2 flex w-full  justify-center  items-center flex-grow md:flex-grow-0 rounded-xl ${
               tab === "CLOSE"
                 ? "text-slate-700 bg-[#001E451A]"
                 : "  text-[#6a6f89] "
             } font-semibold `}
          onClick={() => changeTab("CLOSE")}
        >
          Close
        </button>
      </div>

      {/* <DropdownMenu>
          <DropdownMenuTrigger className=" bg-[#272837] shadow-inner shadow-gray-700   justify-center  md:w-fit  text-xs 2xl:text-base px-3.5 py-2 rounded-xl inline-flex items-center gap-2">
            <Image
              src="/icons/sort.png"
              alt="Arrow Icon"
              width={15}
              height={15}
            />
            Sort
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mr-12 bg-[#181926] text-white border-none  mt-1  p-3 rounded-lg shadow-gray-700 shadow-sm">
            <DropdownMenuItem className="flex text-xs 2xl:text-base items-center justify-between " onClick={()=>sortBets("LAST_7_DAYS") } >
              <p>LAST 7 DAYS</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex text-xs 2xl:text-base items-center justify-between " onClick={()=>sortBets("LAST_14_DAYS") } >
              <p>LAST 14 DAYS</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex text-xs 2xl:text-base items-center justify-between " onClick={()=>sortBets("LAST_30_DAYS") } >
              <p>LAST 30 DAYS</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="  bg-white rounded-2xl border-none">
          <TableRow className=" border-none">
            <TableHead className="   capitalize font-bold text-center text-xs 2xl:text-sm">
              id
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              sport
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              event
            </TableHead>
            {/* <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              market name
            </TableHead> */}
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              odds
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              pick
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              outcome
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              payout
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              bet date
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              game date
            </TableHead>
            <TableHead className="  capitalize font-bold text-center text-xs 2xl:text-sm">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow className=" border-none">
              <TableCell
                colSpan={12}
                className=" font-semibold  text-xs 2xl:text-sm text-center truncate"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}
          {!isPending && currentBets.length === 0 && (
            <TableRow className=" border-none">
              <TableCell
                colSpan={12}
                rowSpan={2}
                className=" font-semibold  text-xs 2xl:text-sm text-center truncate"
              >
                No {tab} bets found
              </TableCell>
            </TableRow>
          )}
          {!isPending &&
            currentBets &&
            currentBets.length > 0 &&
            currentBets?.map((bet: any, index: number) => {
              function convertUTCDateToLocalDate(date: Date): Date {
                const newDate = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60 * 1000
                );
                return newDate;
              }

              const date = convertUTCDateToLocalDate(new Date(bet.betDate));

              const options1: Intl.DateTimeFormatOptions = {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              };
              const options2: Intl.DateTimeFormatOptions = {
                month: "long",
                day: "numeric",
                year: "numeric",
              };

              const timeString = new Intl.DateTimeFormat(
                "en-US",
                options1
              ).format(date);
              const dateString = new Intl.DateTimeFormat(
                "en-US",
                options2
              ).format(date);

              return (
                <TableRow className=" border-none" key={index}>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center truncate">
                    {bet.id}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center truncate">
                    {bet.sport?.join(", ")}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[120px] capitalize text-xs 2xl:text-sm text-center truncate">
                    {bet.event?.join(", ")}
                  </TableCell>
                  {/* <TableCell className="font-semibold  capitalize text-xs 2xl:text-sm text-center truncate">
                    {bet.bets && bet.bets.length > 0 ? (
                      <table className="table-auto w-full border-collapse border border-gray-700 mx-auto text-xs">
                        <thead>
                          <tr>
                            <th className="border border-gray-700 px-2 py-1">
                              Market Name
                            </th>
                            <th className="border border-gray-700 px-2 py-1">
                              Selected Market
                            </th>
                            <th className="border border-gray-700 px-2 py-1">
                              Odds
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bet.bets.map((market: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="border border-gray-700 px-2 py-1">
                                {market.marketName}
                              </td>

                              <td className="border border-gray-700 px-2 py-1">
                                {market.selectedBet && market.selectedBet}
                              </td>
                              <td className="border border-gray-700 px-2 py-1">
                                {market.odds}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span className="text-gray-500">No bets available</span>
                    )}
                  </TableCell> */}

                  {/* <TableCell className=" font-semibold max-w-[120px] capitalize text-xs 2xl:text-sm text-center truncate">
                      {bet.team?.join(", ")}
                    </TableCell> */}
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center truncate">
                    {bet.odds}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center truncate">
                    ${bet.pick}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[130px]  h-full capitalize text-xs 2xl:text-sm text-center truncate">
                    <p
                      className={`px-2 py-1 border w-full  h-full justify-center mt-2 rounded-full ${
                        bet.betStatus === "CLOSED" && bet.betResult === "WIN"
                          ? "bg-green-500/20 text-green-500 border-green-500"
                          : "bg-red-500/20 text-red-500 border-red-500"
                      } ${
                        bet.betStatus === "OPENED"
                          ? "!bg-[#C02FF5]/20 !border !border-[#C02FF5] !text-[#C02FF5]"
                          : ""
                      }

                    `}
                    >
                      {bet.betResult || "IN PROGRESS"}
                    </p>
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center truncate">
                    ${bet.winnings?.toFixed(2)}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center ">
                    {formatDate(bet.betDate)}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-sm text-center ">
                    {bet.gameDate?.map(
                      // (date: string) => `${formatDate(date)} `
                      (date: string) =>
                        `${convertUTCDateToLocalDate(
                          new Date(date)
                        ).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                          // hour: "2-digit",
                          // minute: "2-digit",
                          // hour12: true,
                        })}\n `
                    )}
                  </TableCell>
                  <TableCell className=" font-semibold  capitalize text-xs 2xl:text-sm text-center ">
                    <Dialog>
                      <DialogTrigger className=" w-fit bg-vintage-50 text-white text-xs 2xl:text-sm text-nowrap rounded-full px-5 py-2 inline-flex items-center gap-3">
                        <span className=" font-semibold ">Bet slip</span>{" "}
                      </DialogTrigger>
                      <BetSlipDialogBody bet={bet} key={bet.id} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-5">
        <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base ">
          PAGE {currentPage} OF {Math.ceil(filteredBets?.length / betsPerPage)}
        </h4>
        <div className="flex gap-2 items-center">
          <button
            className="text-[#848BAC] text-2xl"
            onClick={goToPreviousPage}
          >
            <TiArrowLeft />
          </button>
          <button className=" text-2xl" onClick={goToNextPage}>
            <TiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const BetSlipDialogBody = ({ bet }: { bet: any }) => (
  <DialogContent className=" bg-white gap-1 p-5 text-vintage-50 border-none  md:max-w-[1200px] 2xl:min-w-[1300px] flex flex-col ">
    <h2 className=" text-3xl font-bold mb-5">BET SLIP</h2>
    <div className="flex items-start justify-center gap-5 2xl:mb-6 w-full">
      <div className="flex flex-col space-y-3 items-center bg-slate-100 shadow-inner min-w-[35%]  shadow-slate-200 rounded-xl px-3.5 py-5">
        <div className=" w-full flex items-center justify-between gap-6">
          <p className=" text-lg font-bold ">
            {bet.eventId.length > 1 ? "PARLAY " : "1 PICK "}
            {bet.betStatus === "OPENED" && "TO WIN"}
            {bet.betResult !== "LOSE" && (
              <span className="text-black ml-1.5">
                {bet.betResult === "WIN" && "+"}${bet.winnings.toFixed(2)}
              </span>
            )}
          </p>
          {bet.betStatus === "OPENED" && (
            <p className="text-purple-700 font-bold px-6 py-1.5 rounded-lg bg-[#C02FF5]/20 border border-[#C02FF5] text-xs 2xl:text-sm">
              IN PROGRESS
            </p>
          )}
          {bet.betResult === "LOSE" && (
            <p className="text-red-700 font-bold px-6 py-1.5 rounded-lg bg-[#F74418]/20 border border-[#F74418] text-xs 2xl:text-sm">
              LOSS{" "}
            </p>
          )}
          {bet.betResult === "WIN" && (
            <p className="text-green-700 font-bold px-6 py-1.5 rounded-lg bg-[#52FC18]/20 border border-[#52FC18] text-xs 2xl:text-sm">
              WIN
            </p>
          )}
        </div>
        <div className="flex flex-col max-h-44 2xl:max-h-56 mt-1 overflow-auto px-1 w-full gap-3 ">
          {bet.event.length > 1 &&
            bet.event.map((event: string, index: number) => (
              <div className="bg-vintage-50 text-white shadow-inner w-full shadow-gray-800 p-3 rounded-lg ">
                <p className=" text-sm mb-2">{event}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm">{bet.team[index]}</p>
                  </div>
                  {/* <p className="font-bold">{bet.odds}</p> */}
                </div>
              </div>
            ))}
          {bet.event.length === 1 && (
            <div className="bg-vintage-50 text-white shadow-inner w-full shadow-gray-800 p-3 rounded-lg ">
              <p className=" text-sm mb-2">{bet.event[0]}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm">{bet.team[0]}</p>
                </div>
                <p className="font-bold">{bet.odds}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full pt-2">
          <p className="  font-bold text-primary-200">ODDS</p>
          <p className="  font-bold ">{bet.odds}</p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="  font-bold text-primary-200">STAKE</p>
          <p className="  font-bold ">${bet.pick}</p>
        </div>
        <div className="flex items-center justify-between w-full border-b pb-3.5 border-slate-700">
          <p className="  font-bold text-primary-200">WINNING</p>
          <p className="  font-bold ">${bet.winnings.toFixed(2)}</p>
        </div>
        <div className="flex w-full px-4 py-2 items-center justify-center">
          <p className="text-vintage-50 font-bold px-2 py-1.5 rounded-lg bg-[#737897]/20 border border-[#737897] text-xs 2xl:text-sm">
            {formatDate(bet.betDate)}
          </p>
        </div>
      </div>
    </div>
  </DialogContent>
);

export default BetHistory;
