"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RxCross2 } from "react-icons/rx";

import { MAX_PROFIT_THRESHOLD, profileLevels, tabs } from "@/lib/constants";
import Image from "next/image";

import { useGetAccounts } from "@/app/hooks/useGetAccounts";
import { useGetUser } from "@/app/hooks/useGetUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import { accountStore } from "@/app/store/account";
import { getOriginalAccountValue } from "@/lib/utils";
import PayoutModal from "./payout-modal";
import { signOut, useSession } from "next-auth/react";
import { CertificateType, User } from "@prisma/client";
import FundedPayoutRequestsTable from "./payout-requests";
import { useSearchParams } from "next/navigation";
import { ChevronDown, LoaderCircle, LoaderCircleIcon } from "lucide-react";
import { useSendCertificate } from "@/app/hooks/useSendCertificate";
import toast from "react-hot-toast";
import { usePostAvatar } from "@/app/hooks/usePostAvatar";
import { useGetFundedPayout } from "@/app/hooks/useGetFundedPayout";
import { FaCircleCheck } from "react-icons/fa6";

interface Account {
  id: string;
  userId: string;
  accountType: "TWO_STEP" | "THREE_STEP"; // If there are other types, you can add them here
  accountSize: string; // If there are other sizes, you can add them here
  status: "CHALLENGE" | "FUNDED" | "BREACHED"; // Add other possible statuses if needed
  balance: number;
  accountNumber: string;
  paymentMethod: string | null;
  createdAt: string; // Alternatively, use `Date` if parsing to Date object is needed
  updatedAt: string; // Same as above, use `Date` if necessary
}

// type ProfileLevel =
//   | "NEWBIE"
//   | "BRONZE"
//   | "SILVER"
//   | "GOLD"
//   | "PLATINUM"
//   | "HERO";

type ProfileLevel =
  | "Beginner"
  | "Superviser"
  | "Coach"
  | "TopTier"
  | "RegionalPlayer";

const page = () => {
  // Search Params
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";

  // Tabs
  const [tab, setTab] = useState<string>(defaultTab);
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  // GET ACCOUNTS
  const { data: userAccounts, isPending } = useGetAccounts();

  return (
    <>
      <div className=" w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-2">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-4 md:p-6 rounded-2xl">
          <div className="">
            <h2 className="text-lg 2xl:text-xl text-vintage-50 font-bold">
              Account Profile
            </h2>
          </div>
        </div>

        <div className=" w-full grid grid-cols-1 md:grid-cols-2  gap-2 ">
          <div className=" bg-white  p-4 md:p-6 rounded-2xl h-[230px] relative ">
            <ImageUpload />
          </div>
          <div className=" bg-white  p-4 md:p-6 rounded-2xl h-[230px] relative ">
            <Image
              src="/vintage/images/star.svg"
              alt="User"
              width={50}
              height={50}
              className=" mb-4"
            />
            <p className="text-lg 2xl:text-xl font-semibold mb-1">
              Upgrade your profile level{" "}
            </p>
            <p>
              Upgrade your profile level and get exclusive access to discrod
              roles
            </p>
            <ProfileLevel />
          </div>
        </div>
        <div className=" bg-white p-4 md:p-6 rounded-2xl">
          <div className="flex items-center justify-evenly md:justify-start flex-wrap gap-2 mb-8">
            {tabs.map((curr, index) => (
              <button
                key={index}
                className={`border  
             px-5 text-xs 2xl:text-sm py-2 flex-grow md:flex-grow-0 rounded-full ${
               tab === curr.name
                 ? "border-[#001e4500] bg-[#001E451A] text-black"
                 : "  bg-transparent border-none text-[#848BAC] "
             } font-semibold capitalize  `}
                onClick={() => changeTab(curr.name)}
              >
                {curr.name}
              </button>
            ))}
          </div>
          {tab === "profile" && <ProfileMilestone />}
          {tab === "accounts" && <AccountsSection accounts={userAccounts} />}
          {tab === "payouts" && <PayoutsSection />}
          {/* {tab === "certificates" && <CertificaeSection />} */}
        </div>
      </div>
    </>
  );
};

export default page;

const ImageUpload = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const { data, isPending, refetch } = useGetUser();
  console.log("🚀 ~ ImageUpload ~ data:", data);

  const handleImageUpload = () => {
    imageRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
    }
  };

  const { mutate: postAvatar, isPending: uploading } = usePostAvatar({
    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to upload avatar");
    },
  });

  useEffect(() => {
    if (image) {
      postAvatar(image);
    }
  }, [image]);

  if (isPending) {
    return (
      <div className=" p-4  rounded-xl flex items-center justify-center ">
        <LoaderCircle className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="  flex items-center justify-between ">
        <div className="flex gap-3 items-center">
          <div className=" relative">
            {data?.user?.avatar ? (
              <Image
                src={data.user.avatar}
                alt="User"
                width={50}
                height={50}
                className="rounded-full object-cover object-center !w-16 2xl:!w-20 !h-16 2xl:!h-20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 border border-gray-500 flex justify-center items-center text-xl text-gray-400">
                {`${data.user?.firstName[0]}${data.user?.lastName[0]}`}
              </div>
            )}
            <button
              disabled={uploading}
              className=" inline-flex items-center absolute right-0 bottom-1   disabled:opacity-20"
              onClick={handleImageUpload}
            >
              <Image
                src="/vintage/images/edit.svg"
                alt="Edit"
                width={32}
                height={32}
              />
              {/* {uploading ? "Uploading..." : "Edit Avatar"} */}
            </button>
          </div>
          <div className="flex flex-col-reverse">
            <p className=" text-sm font-bold text-[#848BAC] ">Username</p>
            <h3 className="font-semibold text-2xl capitalize text-vintage-50">
              {`${data.user?.firstName} ${data.user?.lastName}`}
            </h3>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          accept="image/*"
          onChange={handleImageChange}
        />
        {uploading && (
          <div className="flex items-center gap-2">
            <LoaderCircleIcon className="animate-spin" />
            <p className="text-sm text-vintage-50">Uploading...</p>
          </div>
        )}
      </div>
      <div className=" p-4  mt-5 rounded-xl flex items-start justify-between bg-[#2160EB38]">
        <div className="flex gap-3 items-center">
          <div className="">
            <Image
              src={
                profileLevels[data?.user?.profileLevel as ProfileLevel]?.icon
              }
              alt="User"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col-reverse">
            <p className=" text-sm font-bold text-[#848BAC] ">Profile Level</p>
            <h3 className="font-semibold text-2xl">
              {isPending ? "Loading..." : data.user?.profileLevel}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileLevel = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const { data, isPending, refetch } = useGetUser();

  const handleImageUpload = () => {
    imageRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
    }
  };

  const { mutate: postAvatar, isPending: uploading } = usePostAvatar({
    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to upload avatar");
    },
  });

  useEffect(() => {
    if (image) {
      postAvatar(image);
    }
  }, [image]);

  if (isPending) {
    return (
      <div className="rounded-xl pt-8 flex items-center justify-center ">
        <LoaderCircle className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="  ">
        <div className="flex items-center justify-between mt-4 mb-2">
          <h4 className="2xl:text-base text-sm font-semibold">
            Progress to next level
          </h4>
          <h4 className="2xl:text-base text-sm font-semibold">
            {data?.user?.picksWon}/
            {profileLevels[data?.user?.profileLevel as ProfileLevel]?.target}{" "}
            Picks Won
          </h4>
        </div>
        <div className=" w-full h-3 bg-[#A879FD1A] rounded-3xl">
          <div
            className="bg-gradient-to-r from-[#A879FD] to-[#773EFD] shadow-inner rounded-md shadow-gray-200 h-full"
            style={{
              width: `${
                (data?.user?.picksWon /
                  profileLevels[data?.user?.profileLevel as ProfileLevel]
                    ?.target) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

const ProfileMilestone = () => {
  const milestones = [
    {
      title: "Beginner",
      milestone: "Win 10 Picks Across all of your accounts",
      rewards: [
        {
          title: "Exclusive discord role",
          included: false,
        },
        {
          title: "Special giveaway entries",
          included: false,
        },
        {
          title: "Secret discounts",
          included: true,
        },
        {
          title: "First access to features",
          included: true,
        },
        {
          title: "Premium bonuses",
          included: false,
        },
        {
          title: "Event invitations",
          included: false,
        },
        {
          title: "Priority support",
          included: true,
        },
      ],
    },
    {
      title: "Superviser ",
      milestone: "Win 25 Picks Across all of your accounts",
      rewards: [
        {
          title: "Exclusive discord role",
          included: false,
        },
        {
          title: "Special giveaway entries",
          included: true,
        },
        {
          title: "Secret discounts",
          included: true,
        },
        {
          title: "First access to features",
          included: true,
        },
        {
          title: "Premium bonuses",
          included: false,
        },
        {
          title: "Event invitations",
          included: false,
        },
        {
          title: "Priority support",
          included: true,
        },
      ],
    },
    {
      title: "Coach",
      milestone: "Win 50 Picks Across all of your accounts",
      rewards: [
        {
          title: "Exclusive discord role",
          included: true,
        },
        {
          title: "Special giveaway entries",
          included: true,
        },
        {
          title: "Secret discounts",
          included: true,
        },
        {
          title: "First access to features",
          included: true,
        },
        {
          title: "Premium bonuses",
          included: true,
        },
        {
          title: "Event invitations",
          included: false,
        },
        {
          title: "Priority support",
          included: true,
        },
      ],
    },
    {
      title: "Top Tier",
      milestone: "Win 100 Picks Across all of your accounts",
      rewards: [
        {
          title: "Exclusive discord role",
          included: true,
        },
        {
          title: "Special giveaway entries",
          included: true,
        },
        {
          title: "Secret discounts",
          included: true,
        },
        {
          title: "First access to features",
          included: true,
        },
        {
          title: "Premium bonuses",
          included: true,
        },
        {
          title: "Event invitations",
          included: true,
        },
        {
          title: "Priority support",
          included: true,
        },
      ],
    },
    {
      title: "Regional Player",
      milestone: "Win 200 Picks Across all of your accounts",
      rewards: [
        {
          title: "Exclusive discord role",
          included: true,
        },
        {
          title: "Special giveaway entries",
          included: true,
        },
        {
          title: "Secret discounts",
          included: true,
        },
        {
          title: "First access to features",
          included: true,
        },
        {
          title: "Premium bonuses",
          included: true,
        },
        {
          title: "Event invitations",
          included: true,
        },
        {
          title: "Priority support",
          included: true,
        },
      ],
    },
  ];

  return (
    <div className=" w-full grid grid-cols-1 pb-8  sm:grid-cols-2 md:grid-cols-3  2xl:grid-cols-5 gap-4">
      {milestones.map((milestone, index) => (
        <div
          className=" bg-[#F8F8F8] rounded-2xl overflow-hidden shadow-md"
          key={index}
        >
          <div className="flex flex-col p-6 items-center gap-4">
            <Image
              src={`/vintage/images/${index + 1}.svg`}
              alt="Role Icon"
              width={60}
              height={60}
            />
            <h2 className="text-xl 2xl:text-2xl font-semibold text-vintage-50">
              {milestone.title}
            </h2>
            <p className="text-sm text-center 2xl:text-base">
              {milestone.milestone}
            </p>
          </div>
          <div className=" mt-4 bg-white p-4 flex flex-col pb-6  space-y-1.5">
            {milestone.rewards.map((milestone, index) => (
              <p className=" inline-flex items-center gap-2" key={index}>
                {milestone.included ? (
                  <FaCircleCheck className="text-slate-400 2xl:text-lg" />
                ) : (
                  <RxCross2 className="text-red-600 bg-slate-400 rounded-full 2xl:text-lg" />
                )}
                <span className="text-sm 2xl:text-base capitalize text-gray-700">
                  {milestone.title}
                </span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

type sortFilterType = "ALL" | "FUNDED" | "BREACHED" | "CHALLENGE";
const AccountsSection = ({ accounts }: { accounts: Account[] }) => {
  const [tab, setTab] = useState("hide");
  const [sortFilter, setSortFilter] = useState<sortFilterType>("ALL");

  // Search Params
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status) {
      setSortFilter(status.toUpperCase() as sortFilterType);
    }
  }, [status]);

  // Sort Filter
  const changeSortFilter = (sortFilter: sortFilterType) => {
    setSortFilter(sortFilter);
  };

  // Filter
  const filteredData = useMemo(() => {
    // Tab Filer
    const filteredData = accounts?.filter((account: any) => {
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
  }, [tab, accounts, sortFilter]);

  return (
    <div className=" w-full space-y-5 md:-mt-[4.85rem] mb-8">
      <div className=" w-full flex flex-col gap-3 md:flex-row items-center  justify-end ">
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-fit">
          {tab !== "show" ? (
            <button
              onClick={() => setTab("show")}
              className="  text-vintage-50  w-full md:w-fit text-sm font-semibold px-3.5 py-2 rounded-xl inline-flex items-center justify-center gap-2"
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
              className=" text-vintage-50 w-full md:w-fit text-sm font-semibold px-3.5 py-2 rounded-xl inline-flex items-center justify-center gap-2"
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
            <DropdownMenuTrigger className=" text-slate-700   justify-center w-full md:w-fit  text-xs 2xl:text-base px-3.5 py-2 rounded-xl inline-flex items-center gap-2">
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
      {filteredData?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <Image
            src="/vintage/images/logo.svg"
            alt="Arrow Icon"
            width={100}
            height={100}
            className=" pt-8"
          />
          {sortFilter === "ALL" ? (
            <p className="text-center capitalize font-semibold tracking-wide bg-vintage-50 text-white px-8 py-3 mb-12 rounded-lg">
              No accounts found
            </p>
          ) : (
            <p className="text-center capitalize font-semibold tracking-wide bg-vintage-50 text-white px-8 py-3 mb-12 rounded-lg">
              No {sortFilter} accounts found
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        {filteredData?.map((account, index) => (
          <div
            key={index}
            className="   overflow-hidden relative   w-full  flex flex-col gap-1 p-2 md:p-6 "
          >
            <div className=" w-full flex items-center mb-3 justify-between">
              <p className=" text-vintage-50  2xl:text-xl text-lg font-semibold">
                ${account.accountSize.replace("K", "000")}
              </p>
              <p
                className={` px-8 py-2.5 2xl:py-3 text-xs 2xl:text-sm font-bold rounded-full 
                  ${
                    account.status === "FUNDED"
                      ? "  bg-[#0F840C1F] text-green-700 border border-[#0F840C3D] "
                      : account.status === "BREACHED"
                      ? " bg-[#FF00001F] text-[#ff00009e] border border-[#FF00003D] "
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
          </div>
        ))}
      </div>
    </div>
  );
};

const PayoutsSection = () => {
  const account = accountStore((state) => state.account);
  const accountSize = getOriginalAccountValue(account);
  const monthlyProfitCap = accountSize * MAX_PROFIT_THRESHOLD;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false); // State to trigger refetch

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to trigger refetch when payout is successful
  const handlePayoutSuccess = () => {
    setShouldRefetch(true);
    setTimeout(() => setShouldRefetch(false), 500); // Reset refetch flag after triggering
  };

  const getTotalPayoutProfit = () => {
    const profit = account.balance - accountSize;

    if (profit < 0 || account.status !== "FUNDED") {
      return 0;
    }

    return Math.min(profit, monthlyProfitCap);
  };

  return (
    <>
      <PayoutModal
        open={isModalOpen}
        onClose={closeModal}
        handlePayoutSuccess={handlePayoutSuccess}
      />
      <div className=" w-full space-y-5 mb-8">
        <div className=" bg-vintage-50 p-3 pb-8 md:p-7  overflow-hidden relative min-h-32 2xl:min-h-44 rounded-2xl w-full  flex flex-col gap-1 ">
          <div className=" text-slate-50 mb-3 mt-4 md:mt-0 2xl:text-lg font-semibold flex justify-between items-center">
            Total Payout Amount
            {/* {account.status === "FUNDED" && ( */}
            <button
              type="submit"
              className="p-3.5 px-6 font-semibold justify-center capitalize  w-full md:w-fit  text-sm rounded-full inline-flex items-center gap-2 bg-white text-vintage-50 disabled:opacity-20 hover:outline hover:outline-blue-400/40"
              onClick={openModal}
            >
              {"Request Payout"}
            </button>
            {/* )} */}
          </div>
          <div className=" flex items-center gap-4 text-white">
            <p className="flex flex-col md:mt-0 text-3xl  2xl:text-4xl font-semibold">
              $ {getTotalPayoutProfit().toFixed(2)}
              <span className="text-sm text-slate-50 font-thin">
                You can only request payount once in 14 days. You max monthly
                profit cap is ${monthlyProfitCap}.
              </span>
            </p>
          </div>
        </div>
        <FundedPayoutRequestsTable shouldRefetch={shouldRefetch} />
      </div>
    </>
  );
};

const CertificaeSection = () => {
  const account = accountStore((state) => state.account);
  const { data: payoutHistory, isPending: fetchingPayoutHistory } =
    useGetFundedPayout(account.id);
  const { data: accounts, isPending: fetchingAccounts } = useGetAccounts();
  const { mutate: sendCertificate, isPending } = useSendCertificate({
    onSuccess: () => {
      toast.success("Certificate sent successfully");
    },
    onError: (error: any) => {
      // console.log("Failed to send certificate", error);
      toast.error("Failed to send certificate");
    },
  });

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account: Account) => account.status === "FUNDED");
  }, [accounts]);

  const handleSendCertificate = (
    certificateType: CertificateType,
    accountId?: string
  ) => {
    sendCertificate({
      certificateType,
      accountId: accountId || account.id,
    });
  };

  return (
    <div
      className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4   gap-4    mb-8 transition-opacity
      ${
        isPending
          ? " opacity-50 pointer-events-none "
          : " opacity-100 pointer-events-auto"
      }
    `}
    >
      <button
        disabled={fetchingAccounts || filteredAccounts.length === 0}
        className={` bg-[#F4F4F4] p-3 md:p-6 text-center  overflow-hidden relative min-h-32 2xl:min-h-44 items-start rounded-2xl w-full  flex flex-col gap-3
        ${
          !fetchingAccounts && filteredAccounts.length === 0
            ? " disabled:opacity-20 disabled:cursor-not-allowed"
            : ""
        }
        `}
      >
        <Image
          src="/vintage/images/certificateBadge1.svg"
          alt="Arrow Icon"
          width={45}
          height={45}
          className=" absolute bottom-3 right-3 "
        />
        <div className=" flex items-center justify-between w-full ">
          <p className=" text-lg  2xl:text-xl text-vintage-50 font-semibold">
            Funded
          </p>
          <Dialog>
            {!fetchingAccounts && filteredAccounts.length > 0 ? (
              <DialogTrigger className=" flex items-center px-4 py-1.5  shadow-inner rounded-full bg-vintage-50 gap-1 text-white font-bold 2xl:text-sm text-xs ">
                View {filteredAccounts.length} Certificates
              </DialogTrigger>
            ) : !fetchingAccounts && filteredAccounts.length === 0 ? (
              <div className="flex items-center px-4 py-1.5   rounded-full gap-1 text-white bg-vintage-50 font-bold text-xs 2xl:text-sm">
                No funded accounts
              </div>
            ) : (
              <div className="flex items-center px-4 py-1.5   rounded-full gap-1 text-white bg-vintage-50 font-bold text-xs 2xl:text-sm">
                <LoaderCircleIcon className="animate-spin mr-2" />
                Loading...
              </div>
            )}
            <DialogContent className=" bg-white text-vintage-500 p-8 border-none">
              <DialogHeader>
                <DialogTitle className=" text-xl font-bold mb-4">
                  FUNDED CERTIFICATES
                </DialogTitle>
                <div className="flex flex-col gap-2 w-full">
                  {filteredAccounts.length === 0 && (
                    <div className=" p-4 bg-vintage-50 text-white rounded-xl py-8  flex items-center justify-between">
                      <div className="flex items-center ">
                        <div className="w-12 h-12 rounded-xl mr-2.5 bg-blue-950"></div>
                        <div className=" flex flex-col  gap-1">
                          <h2 className=" text-sm md:text-base font-bold">
                            No funded accounts
                          </h2>
                        </div>
                      </div>
                    </div>
                  )}
                  {!fetchingAccounts &&
                    filteredAccounts.map((account: Account) => (
                      <div className=" p-4 bg-vintage-50 text-white rounded-xl py-8  flex items-center justify-between">
                        <div className="flex items-center ">
                          <div className=" flex flex-col  gap-1">
                            <h2 className=" text-sm md:text-base font-bold">
                              {account.accountNumber}
                            </h2>
                          </div>
                        </div>
                        <button
                          className="inline-flex items-center gap-2"
                          onClick={() =>
                            handleSendCertificate("FUNDED", account.id)
                          }
                        >
                          <Image
                            src="/icons/download.png"
                            alt="Arrow Icon"
                            width={15}
                            height={15}
                          />
                          <p className="text-xs  font-bold">DOWNLOAD</p>
                        </button>
                      </div>
                    ))}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <p className="   text-[#848BAC]  2xl:text-sm text-xs ">
          Click to get your certificate
        </p>
      </button>
      <button
        className=" bg-[#F4F4F4] p-3 md:p-6 text-center overflow-hidden relative min-h-32 2xl:min-h-44 items-start rounded-2xl w-full  flex flex-col gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
        disabled={
          !(
            account.status === "FUNDED" &&
            !fetchingPayoutHistory &&
            payoutHistory &&
            payoutHistory.length > 0
          )
        }
        onClick={() =>
          account.status === "FUNDED" &&
          !fetchingPayoutHistory &&
          payoutHistory.length > 0 &&
          handleSendCertificate("PAYOUT")
        }
      >
        <Image
          src="/vintage/images/certificateBadge2.svg"
          alt="Arrow Icon"
          width={45}
          height={45}
          className=" absolute bottom-3 right-3 "
        />
        <div className=" flex items-center ">
          <p className=" text-lg  2xl:text-xl text-vintage-50 font-semibold">
            Payout
          </p>
        </div>
        <p className="   text-[#848BAC]  2xl:text-sm text-xs ">
          Click to get your certificate
        </p>
      </button>

      <button
        className=" bg-[#F4F4F4] p-3 md:p-6 text-center overflow-hidden relative min-h-32 2xl:min-h-44 items-start rounded-2xl w-full  flex flex-col gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
        disabled={
          !(
            account.status === "FUNDED" &&
            !fetchingPayoutHistory &&
            payoutHistory.length > 0
          )
        }
        onClick={() =>
          account.status === "FUNDED" &&
          !fetchingPayoutHistory &&
          payoutHistory.length > 0 &&
          handleSendCertificate("LIFETIME_PAYOUT")
        }
      >
        <Image
          src="/vintage/images/certificateBadge3.svg"
          alt="Arrow Icon"
          width={45}
          height={45}
          className=" absolute bottom-3 right-3 "
        />
        <div className=" flex items-center ">
          <p className=" text-lg  2xl:text-xl text-vintage-50 font-semibold">
            Lifetime Payout
          </p>
        </div>
        <p className="   text-[#848BAC]  2xl:text-sm text-xs ">
          Click to get your certificate
        </p>
      </button>
      <div
        className=" bg-[#F4F4F4] p-3 md:p-6 text-center overflow-hidden relative min-h-32 2xl:min-h-44 items-start rounded-2xl w-full  flex flex-col gap-3 "
        role="button"
        onClick={() => handleSendCertificate("PROFILE_LEVEL")}
      >
        <Image
          src="/vintage/images/certificateBadge4.svg"
          alt="Arrow Icon"
          width={45}
          height={45}
          className=" absolute bottom-3 right-3 "
        />
        <div className=" flex items-center ">
          <p className=" text-lg  2xl:text-xl text-vintage-50 font-semibold">
            Profile Level
          </p>
        </div>
        <p className="   text-[#848BAC]  2xl:text-sm text-xs ">
          Click to get your certificate
        </p>
      </div>
    </div>
  );
};
