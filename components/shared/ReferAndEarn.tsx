"use client";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import {
  LEVEL_1_TARGET,
  LEVEL_2_TARGET,
  REFER_COMMISSIONS,
} from "@/lib/constants";
import { useGetUser } from "@/app/hooks/useGetUser";
import { useGetReferHistory } from "@/app/hooks/useGetReferHistory";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PayoutModal from "@/app/(root)/refer-and-earn/payout-modal";
import { Loader2 } from "lucide-react";
import Milestones from "@/components/shared/Milestones";

const page = () => {
  const [toggle, setToggle] = useState(false);
  const [copySuccess, setCopySuccess] = useState(""); // To show copy success message
  const currentUser: any = useSession().data?.user;

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  let link = `${
    process.env.NODE_ENV === "production"
      ? "https://app.vantagepicks.com"
      : "http://localhost:3000"
  }/signup?referrerCode=${currentUser.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  const { data: referHistory, isPending: referHistoryPending } =
    useGetReferHistory();
  const { data: user, isPending } = useGetUser();

  const getUserCommision = (totalReferrals: number) => {
    // Determine referral level
    let referralLevel: "level1" | "level2" | "level3" = "level1";
    if (totalReferrals < LEVEL_1_TARGET) {
      referralLevel = "level1";
    } else if (totalReferrals < LEVEL_2_TARGET) {
      referralLevel = "level2";
    } else {
      referralLevel = "level3";
    }

    const levelInformation = REFER_COMMISSIONS[referralLevel];
    return levelInformation.commission;
  };

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

  // Payout Modal
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const openPayoutModal = () => setPayoutModalOpen(true);
  const closePayoutModal = () => setPayoutModalOpen(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust as needed

  const totalPages = useMemo(
    () => Math.ceil(referHistory?.length / rowsPerPage),
    [referHistory?.length, rowsPerPage]
  );

  const currentHistoryPage = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return referHistory?.slice(start, end);
  }, [referHistory, currentPage, rowsPerPage]);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <PayoutModal open={payoutModalOpen} onClose={closePayoutModal} />
      <div className=" w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-2">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-4 md:p-6 rounded-2xl">
          <div className="">
            <h2 className="text-lg 2xl:text-xl text-vintage-50 font-bold">
              Refer & Earn
            </h2>
            <p className="text-sm  ">
              Share your referral code and earn 15% commission
            </p>
          </div>
          <div className="flex items-center  gap-3">
            <Milestones />
            <button
              className="text-white  font-semibold hover:border hover:border-primary-200 uppercase text-[10px] text-nowrap md:text-base 2xl:text-base bg-vintage-50 px-8 py-3.5 rounded-full inline-flex items-center gap-3"
              onClick={openPayoutModal}
            >
              Request Payout
            </button>
          </div>
        </div>
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
          <div className=" bg-white  p-4 md:p-6 rounded-2xl h-[170px] relative ">
            <Image
              src="/vintage/images/earned.svg"
              alt="Total Referals"
              width={50}
              height={50}
              className=" absolute right-3 bottom-3"
            />
            <p className="text-sm  ">Total Earned</p>
            <h2 className="text-2xl 2xl:text-3xl text-vintage-50 font-bold">
              $
              {isPending ? "Loading..." : user.user.totalEarned.toFixed(2) || 0}{" "}
            </h2>
          </div>
          <div className=" bg-white  p-4 md:p-6 rounded-2xl h-[170px] relative ">
            <Image
              src="/vintage/images/earned.svg"
              alt="Total Referals"
              width={50}
              height={50}
              className=" absolute right-3 bottom-3"
            />
            <p className="text-sm  ">Commission Rate</p>
            <h2 className="text-2xl 2xl:text-3xl text-vintage-50 font-bold">
              15%{" "}
            </h2>
          </div>
          <div
            className=" bg-white  p-4 md:p-6 rounded-2xl h-[170px] relative "
            style={{
              backgroundImage: `url('/vintage/images/referBg.svg')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <Image
              src="/vintage/images/earned.svg"
              alt="Total Referals"
              width={50}
              height={50}
              className=" absolute right-3 bottom-3"
            />
            <p className="text-sm  ">Total Payouts</p>
            <h2 className="text-2xl 2xl:text-3xl text-vintage-50 font-bold">
              $
              {isPending
                ? "Loading..."
                : user.user.totalReferPayout.toFixed(2) || 0}{" "}
            </h2>
          </div>
        </div>
        <div className="w-full  rounded-xl p-4 md:p-6  flex flex-col space-y-5 bg-white ">
          <div className="flex flex-col md:flex-row items-start gap-2 md:items-center justify-between w-full ">
            <h3 className="text-lg font-bold">REFERAL HISTORY</h3>
            <div className="border border-blue-700 bg-blue-700/15 p-3 md rounded-2xl w-full md:w-fit flex gap-6 items-center justify-between">
              <h2 className="font-bold text-sm text-vintage-50]">
                Code:
                <span className="text-vintage-50 ml-1">
                  {`${truncateString(link, 30)}`}
                </span>
              </h2>
              {!copySuccess && (
                <button
                  onClick={handleCopyLink}
                  className="uppercase text-xs md:text-sm   rounded-xl inline-flex items-center gap-3"
                >
                  <Image
                    src="/icons/copy.png"
                    alt="Edit"
                    width={15}
                    height={15}
                    className=" invert"
                  />
                </button>
              )}
              {/* Display copy success message */}
              {copySuccess && (
                <p className="text-green-600 font-semibold text-sm">
                  {copySuccess}
                </p>
              )}
            </div>
          </div>
          <Table>
            <TableHeader className="bg-[#F8F8F8] text-[#848BAC] border-none">
              <TableRow className="border-none">
                <TableHead className="text-nowrap font-bold text-center">
                  Date
                </TableHead>
                <TableHead className="text-nowrap font-bold text-center">
                  ORDER VALUE
                </TableHead>
                <TableHead className="text-nowrap font-bold text-center">
                  ORDER NUMBER
                </TableHead>
                <TableHead className="text-nowrap font-bold text-center">
                  COMMISSION
                </TableHead>
                <TableHead className="text-nowrap font-bold text-start">
                  STATUS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referHistoryPending ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : referHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 uppercase">
                    No referal history
                  </TableCell>
                </TableRow>
              ) : (
                currentHistoryPage.map((refer: any) => (
                  <TableRow className="border-none">
                    <TableCell className="font-normal max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                      {formatDate(refer.createdAt)}
                    </TableCell>
                    <TableCell className="font-normal max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                      ${refer.orderValue}
                    </TableCell>
                    <TableCell className="font-normal max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                      #{refer.orderNumber}
                    </TableCell>
                    <TableCell className="font-normal max-w-[100px] capitalize text-xs 2xl:text-base text-center truncate">
                      ${refer.commission}
                    </TableCell>
                    <TableCell className="font-normal max-w-[140px]  text-center  capitalize text-xs 2xl:text-base flex items-start justify-start truncate">
                      {refer.status === "paid" ? (
                        <p className="px-5 py-1 font-semibold bg-green-500/20 text-green-500 border  border-green-500 rounded-full">
                          paid
                        </p>
                      ) : (
                        <p className="px-5 py-1 text-[12px] font-semibold text-[#2160EB] border border-gray-300 bg-[#702EFF1A] rounded-full">
                          OUTSTANDING
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-5">
            <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base">
              PAGE {currentPage} OF {totalPages}
            </h4>
            <div className="flex gap-2 items-center">
              <button
                className="text-[#848BAC] text-2xl"
                onClick={goToPreviousPage}
              >
                <TiArrowLeft />
              </button>
              <button
                className="text-[#848BAC] text-2xl"
                onClick={goToNextPage}
              >
                <TiArrowRight />
              </button>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default page;
