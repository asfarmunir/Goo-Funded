"use client";
import { useGetFundedPayout } from "@/app/hooks/useGetFundedPayout";
import { accountStore } from "@/app/store/account";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FundedPayoutRequests } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";

export default function FundedPayoutRequestsTable({
  shouldRefetch,
}: {
  shouldRefetch: boolean;
}) {
  const account = accountStore((state) => state.account);

  const {
    data: payoutHistoryData,
    isPending,
    refetch,
    isError,
  } = useGetFundedPayout(account.id);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
  }, [shouldRefetch]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch payout history");
    }
  }, [isError]);

  // Sorting by bet date
  const [sortFilter, setSortFilter] = useState<
    "LAST_7_DAYS" | "LAST_14_DAYS" | "LAST_30_DAYS"
  >("LAST_7_DAYS");
  const sortHistory = (
    filter: "LAST_7_DAYS" | "LAST_14_DAYS" | "LAST_30_DAYS"
  ) => {
    setSortFilter(filter);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Derived state: Filtered Bets based on Tab and Sort Filter
  const filteredHistory = useMemo(() => {
    if (!payoutHistoryData) return;

    let filtered = payoutHistoryData;

    const currentDate = new Date();

    switch (sortFilter) {
      case "LAST_7_DAYS":
        filtered = payoutHistoryData.filter((payout: FundedPayoutRequests) => {
          const requestDate = new Date(payout.createdAt);
          const diffTime = currentDate.getTime() - requestDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
        break;
      case "LAST_14_DAYS":
        filtered = payoutHistoryData.filter((payout: FundedPayoutRequests) => {
          const requestDate = new Date(payout.createdAt);
          const diffTime = currentDate.getTime() - requestDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 14;
        });
        break;
      case "LAST_30_DAYS":
        filtered = payoutHistoryData.filter((payout: FundedPayoutRequests) => {
          const requestDate = new Date(payout.createdAt);
          const diffTime = currentDate.getTime() - requestDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 30;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [payoutHistoryData, sortFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust as needed

  const totalPages = useMemo(
    () => Math.ceil(filteredHistory?.length / rowsPerPage),
    [filteredHistory?.length, rowsPerPage]
  );

  const currentHistory = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredHistory?.slice(start, end);
  }, [filteredHistory, currentPage, rowsPerPage]);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className=" w-full border border-gray-700 rounded-xl  flex flex-col">
      <div className="flex items-center justify-between w-full p-6 ">
        <h3 className=" font-bold">PAYOUT HISTORY</h3>
        <DropdownMenu>
          <DropdownMenuTrigger className=" bg-[#F8F8F8]    justify-center  md:w-fit  text-xs 2xl:text-sm px-8 py-2.5 rounded-full inline-flex items-center gap-2">
            <Image
              src="/icons/filter.svg"
              alt="Arrow Icon"
              width={12}
              height={12}
              className=" invert"
            />
            Sort
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48  bg-vintage-50 text-white border-none  mt-1  p-3 rounded-lg shadow-sm">
            <DropdownMenuItem
              className="flex text-xs 2xl:text-base items-center justify-between "
              onClick={() => sortHistory("LAST_7_DAYS")}
            >
              <p>LAST 7 DAYS</p>
              {/* <MdOutlineArrowUpward className="text-lg" /> */}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex text-xs 2xl:text-base items-center justify-between "
              onClick={() => sortHistory("LAST_14_DAYS")}
            >
              <p>LAST 14 DAYS</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex text-xs 2xl:text-base items-center justify-between "
              onClick={() => sortHistory("LAST_30_DAYS")}
            >
              <p>LAST 30 DAYS</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className=" bg-[#F8F8F8] text-black border-none">
          <TableRow className=" border-none">
            <TableHead className="  font-bold text-center">Date</TableHead>
            <TableHead className=" font-bold text-center">
              Invoice Number
            </TableHead>
            <TableHead className=" font-bold text-center">Invoice</TableHead>
            <TableHead className=" font-bold text-center">Status</TableHead>
            {/* <TableHead className=" font-bold text-start">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell colSpan={5} className="text-center" align="center">
                <div className="flex justify-center items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {(!isPending && !isError && currentHistory.length === 0) ||
            (isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No payout history found.
                </TableCell>
              </TableRow>
            ))}

          {!isPending &&
            currentHistory &&
            currentHistory.map((payout: FundedPayoutRequests) => (
              <TableRow className=" border-none">
                <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                  {new Date(payout.createdAt).toUTCString()}
                </TableCell>
                <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                  {payout.id}
                </TableCell>
                <TableCell className=" font-semibold max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                  ${payout.amount}
                </TableCell>
                <TableCell className=" font-semibold  text-center capitalize text-xs 2xl:text-base flex items-center justify-center truncate">
                  {payout.status === "PENDING" && (
                    <p className=" px-4 py-1 mx-auto  bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-full">
                      pending
                    </p>
                  )}
                  {payout.status === "PAID" && (
                    <p className=" px-4 py-1 bg-green-500/20 text-green-500 border border-green-500 rounded-full">
                      paid
                    </p>
                  )}
                  {payout.status === "DECLINED" && (
                    <p className=" px-4 py-1 bg-red-500/20 text-red-500 border border-red-500 rounded-full">
                      rejected
                    </p>
                  )}
                </TableCell>
                {/* <TableCell className=" font-semibold max-w-[120px]  capitalize text-xs 2xl:text-base  justify-center ">
                  <p className="flex items-center gap-1 text-xs  text-green-400 font-semibold ">
                    <Image
                      src="/icons/download.png"
                      alt="Coin Icon"
                      width={14}
                      height={14}
                    />
                    <span className=" ">DOWNLOAD</span>
                  </p>
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-5">
        <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base ">
          PAGE {currentPage} OF {totalPages}
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
}
