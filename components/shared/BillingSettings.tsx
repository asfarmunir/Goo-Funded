"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import { useGetPaymentCard } from "@/app/hooks/useGetPaymentCard";
import { useGetAccountInvoices } from "@/app/hooks/useGetAccountInvoices";
import { useMemo, useState } from "react";

const formatCreditCardNumber = (cardNumber: string) => {
  const censoredCardNum = `**** **** **** ${cardNumber?.slice(-4)}`;
  return censoredCardNum;
};

function padZero(value: number | string, length: number): string {
  let stringValue: string = String(value);

  if (stringValue.length >= length) {
    return stringValue;
  }

  return stringValue.padStart(length, "0");
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1, 2);
  const day = padZero(date.getDate(), 2);
  const hour = padZero(date.getHours(), 2);
  const minute = padZero(date.getMinutes(), 2);

  const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
  const formattedHour = parseInt(hour) % 12 || 12;

  return `${year}-${month}-${day} at ${formattedHour}:${minute} ${ampm}`;
}

const BillingSettings = () => {
  // const { data, isPending, isError } = useGetPaymentCard();
  const {
    data: billingHistory,
    isPending: loadingInvoices,
    isError: errorLoadingInvoices,
  } = useGetAccountInvoices();

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(billingHistory?.invoices?.length / PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, TOTAL_PAGES));
  };
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const completelyBilledHistory = billingHistory?.invoices?.filter(
      (invoice: any) => invoice.status === "paid"
    );
    return completelyBilledHistory?.invoices?.slice(startIndex, endIndex);
  }, [billingHistory, currentPage, PER_PAGE]);

  return (
    <div className=" w-full space-y-2  ">
      <h2 className="text-lg 2xl:text-xl font-semibold text-vintage-50">
        Personal Information
      </h2>
      <p className="text-sm 2xl:text-base -mt-4 mb-1.5 text-gray-700">
        Update your personal information
      </p>
      {/* <div className=" bg-[#272837] p-3 pb-8 md:p-7   rounded-2xl w-full  flex flex-col gap-1 ">
        <div className="flex items-center justify-between pb-6 border-b border-gray-300 mb-3">
          <p className=" text-white  2xl:text-lg  capitalize font-bold">
            Payment Method
          </p>
          <p className=" text-primary-50 flex items-center gap-1.5 2xl:text-base text-xs  capitalize font-bold">
            <Image
              src="/icons/wallet.svg"
              alt="Edit Icon"
              width={17}
              height={17}
            />
            update
          </p>
        </div>

        <div className=" flex items-center gap-4 bg-[#333547] p-5 rounded-lg w-full">
          <Image
            src="/images/visa.png"
            alt="Arrow Icon"
            width={48}
            height={48}
          />
          {isPending ? (
            <p className="text-white text-lg 2xl:text-2xl font-semibold">
              Loading...
            </p>
          ) : isError ? (
            <p className="text-white text-lg 2xl:text-2xl font-semibold">
              No Payment Card Found
            </p>
          ) : (
            <p className="   md:mt-0 text-lg  2xl:text-2xl font-semibold">
              {formatCreditCardNumber(data?.paymentCard.cardNumber)}
            </p>
          )}
        </div>
      </div> */}
      <div className=" w-full py-6   flex flex-col">
        <div className="flex items-center justify-between w-full  ">
          <h3 className=" font-bold text-lg text-vintage-50 mb-4">
            {" "}
            Billing History
          </h3>
        </div>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className=" bg-[#F8F8F8] text-slate-700 border-none">
            <TableRow className=" border-none">
              <TableHead className=" capitalize  font-bold text-center">
                Date
              </TableHead>
              <TableHead className=" capitalize font-bold text-center">
                Invoice Number
              </TableHead>
              <TableHead className=" capitalize font-bold text-center">
                amount
              </TableHead>
              <TableHead className=" capitalize font-bold text-start">
                invoice
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingInvoices && (
              <TableRow className=" border-none">
                <TableCell
                  colSpan={4}
                  className=" font-semibold capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base text-center truncate"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!loadingInvoices && !paginatedHistory && (
              <TableRow className=" border-none">
                <TableCell
                  colSpan={4}
                  className=" font-semibold capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base text-center truncate"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            )}

            {!loadingInvoices &&
              paginatedHistory?.map((invoice: any) => (
                <TableRow key={invoice.id} className=" border-none">
                  <TableCell className=" font-semibold max-w-[100px] capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base text-center truncate">
                    {formatDate(new Date(invoice.paymentDate))}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base text-center truncate">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className=" font-semibold max-w-[100px] capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base text-center truncate">
                    ${invoice.amount}
                  </TableCell>

                  <TableCell className=" font-semibold max-w-[100px]  capitalize py-6 border-b border-gray-300 text-xs 2xl:text-base  justify-center ">
                    <p className="flex items-center gap-1 text-sm   text-vintage-50 font-semibold ">
                      <span className=" ">Download</span>
                    </p>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-5">
          <h4 className="text-slate-700 font-thin text-xs 2xl:text-base ">
            PAGE {currentPage}-{TOTAL_PAGES}
          </h4>
          <div className="flex gap-2 items-center">
            <button
              className="text-slate-700 text-2xl"
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
    </div>
  );
};

export default BillingSettings;
