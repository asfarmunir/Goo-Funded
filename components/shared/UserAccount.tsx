import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { LuChevronsUpDown } from "react-icons/lu";

import { useGetAccounts } from "@/app/hooks/useGetAccounts";
import { accountStore } from "@/app/store/account";
import { Account } from "@prisma/client";
import { ChevronsUpDownIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IoChevronDownCircle } from "react-icons/io5";

const UserAccount = ({
  setUserHasAccounts,
}: {
  setUserHasAccounts?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { data: userAccounts, isPending, isError } = useGetAccounts();

  const challengeColorClasses = {
    CHALLENGE: "text-white  bg-[#1973D3]",
    FUNDED: "text-white  bg-green-700",
    BREACHED: "text-[#F74418]/70 border-[#F74418]/80 bg-[#F74418]/20",
  };

  // Active Account
  const activeAccount = accountStore((state) => state.account);

  // Update Account
  const setActiveAccount = accountStore((state) => state.setAccount);

  // Change User Account
  const changeUserAccount = (account: Account) => {
    setActiveAccount(account);
    localStorage.setItem("account", account.id);
    router.push("/dashboard");
  };

  // Search Params
  const searchParams = useSearchParams();
  const account = searchParams.get("account");

  useEffect(() => {
    if (account && userAccounts) {
      const newActiveAccount = userAccounts.find(
        (userAccount: Account) => userAccount.id === account
      );
      changeUserAccount(newActiveAccount);
    }
  }, [account, userAccounts]);

  useEffect(() => {
    if (!setUserHasAccounts) return;
    if (userAccounts && userAccounts.length > 0) {
      setUserHasAccounts(true);
    } else {
      setUserHasAccounts(false);
    }
  }, [userAccounts]);

  return (
    <div className=" w-full md:w-fit px-4">
      <DropdownMenu>
        <DropdownMenuTrigger className=" data-[state=open]:border-2 bg-[#FFFFFF1A]  data-[state=open]:shadow  data-[state=open]:border-vintage-50/50   bg-[#272837]  font-bold   justify-center text-nowrap w-full md:w-fit  text-xs md:text-sm px-1.5 md:px-1.5 py-1.5 2xl:py-1.5  rounded-full inline-flex items-center gap-2">
          {(!isPending && userAccounts.length === 0) || isError ? (
            <span className="  text-gray-400 flex gap-2 items-center text-xs 2xl:text-sm  px-4 py-2">
              No Account <IoChevronDownCircle className="w-5 text-white h-5" />
            </span>
          ) : (
            <>
              <span className=" text-vintage-50 bg-[#EBCD3F] text-xs 2xl:text-base rounded-full border-r border-gray-600 px-4 py-2.5 md:pr-4">
                ${activeAccount.balance.toFixed(2)}
              </span>
              <p className=" text-[#FFFFFF99]  text-xs bg-[#F4F4F41A] inline-flex items-center rounded-full 2xl:text-base py-2.5 px-4">
                Account
                <span className=" px-1 pl-2 text-white font-semibold">
                  {`#${activeAccount.accountNumber}`}
                </span>
                <IoChevronDownCircle className=" text-2xl text-white pb-1" />
              </p>
              <span
                className={` hidden sm:inline-flex items-center gap-x-1 md:gap-x-1.5 text-xs 2xl:text-base capitalize   px-4 py-2.5 rounded-full
            ${challengeColorClasses[activeAccount.status]}
            `}
              >
                {activeAccount.status}
              </span>
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="   border-none shadow-gray-600   bg-vintage-50 text-white   mt-1  p-2 rounded-xl shadow-base">
          {!isPending &&
            userAccounts.map((account: Account, index: number) => (
              <DropdownMenuItem
                key={index}
                className="flex py-1 items-center gap-6 border-b border-slate-700 md:gap-28 justify-between"
                onClick={() => changeUserAccount(account)}
              >
                <p className="  inline-flex items-center font-bold">
                  ${account.balance.toFixed(2)}{" "}
                  <span className="text-3xl flex  mb-4 mx-1.5">.</span>
                  {account.accountNumber}
                </p>
                <span
                  className={`  font-semibold inline-flex items-center gap-x-1.5 text-xs 2xl:text-base  p-1 px-5  rounded-full ${
                    challengeColorClasses[account.status]
                  }`}
                >
                  {account.status}
                </span>
              </DropdownMenuItem>
            ))}
          {!isPending && userAccounts.length === 0 && (
            <DropdownMenuItem className="flex py-0 items-center gap-14 md:gap-28 justify-between ">
              <p className="  inline-flex items-center font-bold">
                No Accounts Found
              </p>
            </DropdownMenuItem>
          )}
          {isPending && (
            <DropdownMenuItem className="flex py-0 items-center gap-14 md:gap-28 justify-between ">
              <p className="  inline-flex items-center font-bold">
                <LoaderCircle className="animate-spin" />
                Loading Accounts
              </p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {!isPending && userAccounts.length === 0 && (
        <Link
          href={"/create-account"}
          className="ml-4  font-bold text-white w-fit text-sm rounded-full bg-[#1973D3] px-6 py-2.5 2xl:py-3 inline-flex items-center gap-3 hover:opacity-95"
        >
          Add Account
        </Link>
      )}
    </div>
  );
};

export default UserAccount;
