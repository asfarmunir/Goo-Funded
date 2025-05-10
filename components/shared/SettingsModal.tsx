import React, { useEffect, useRef } from "react";

import { useGetPreferences } from "@/app/hooks/useGetPreferences";
import BillingSettings from "@/components/shared/BillingSettings";
import GeneralSettings from "@/components/shared/GeneralSettings";
import PreferenceSettings from "@/components/shared/PreferenceSettings";
import Verification from "@/components/shared/Verification";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import Agreements from "@/app/(root)/settings/agreements";
import { useRouter, useSearchParams } from "next/navigation";

// import KYCVerification from "./kyc-verfication";
const KYCVerification = React.lazy(
  () => import("../../app/(root)/settings/kyc-verfication")
);

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaChevronRight } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { CgFileDocument } from "react-icons/cg";

import { MdOutlineAccountCircle, MdOutlineLockOpen } from "react-icons/md";
import { PiMoney } from "react-icons/pi";
import { GoShieldCheck } from "react-icons/go";

const settingTabs = [
  {
    name: "general",
    tab: "general",
    icon: <MdOutlineAccountCircle className=" text-xl 2xl:text-2xl" />,
  },
  {
    name: "Password",
    tab: "password",
    icon: <MdOutlineLockOpen className="text-xl 2xl:text-2xl" />,
  },
  {
    name: "preferences",
    tab: "preferences",
    icon: <VscSettings className="text-xl 2xl:text-2xl" />,
  },
  {
    name: "billing",
    tab: "billing",
    icon: <PiMoney className="text-xl 2xl:text-2xl" />,
  },
  {
    name: "security",
    tab: "verification",
    icon: <GoShieldCheck className="text-xl 2xl:text-2xl" />,
  },
  {
    name: "agreements",
    tab: "agreements",
    icon: <CgFileDocument className="text-xl 2xl:text-2xl" />,
  },
  //   {
  //     name: "2-STEP verification",
  //     tab: "verification",
  //   },
];

interface SettingsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, setIsOpen, user }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<string>("general");
  const { status, data: session } = useSession();
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  // SEARCH PARAMS
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("tab")) {
      setTab(searchParams.get("tab") as string);
    }
  }, [searchParams]);

  useEffect(() => {
    if (tab) {
      router.push(`/settings?tab=${tab}`);
    }
  }, [tab]);

  // GET PREFERENCES
  const { mutate: fetchPreferences, data: preferences } = useGetPreferences({
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      // console.log(error);
    },
  });

  useEffect(() => {
    if (session) {
      fetchPreferences();
    }
  }, [session]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger ref={modalRef}>
        <IoIosSettings className=" border-t border-gray-600 rounded-full bg-[#FFFFFF1A] hover:cursor-pointer  p-1.5 px-2 text-white text-4xl" />
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col md:flex-row max-h-[95svh] overflow-y-auto gap-4 bg-transparent border-none md:min-w-[1200px] 2xl:min-w-[1400px] ">
        <div className="flex flex-col  h-fit gap-2 p-6 2xl:p-8 rounded-2xl bg-[#001E45] text-white w-full md:w-[30%] ">
          {settingTabs.map((curr, index) => (
            <button
              key={index}
              onClick={() => changeTab(curr.tab)}
              className={`flex capitalize items-center w-full justify-between  p-3 rounded-xl ${
                tab === curr.tab ? "bg-[#FFFFFF1A]" : "opacity-60"
              } `}
            >
              <p className="flex gap-2 items-center">
                {curr.icon}
                <span className="text-sm 2xl:text-base ">{curr.name}</span>
              </p>
              <FaChevronRight className="text-xl" />
            </button>
          ))}
        </div>
        <div className=" bg-white p-6 2xl:p-8 rounded-2xl w-full max-h-[90svh] overflow-y-auto [scrollbar-width:none] relative">
          <AlertDialogCancel className=" absolute right-2 top-2 text-black">
            <MdOutlineClose className=" text-2xl" />
          </AlertDialogCancel>

          {/* <GeneralSettings modalRef={modalRef} tab={tab} /> */}
          {/* <PreferenceSettings
            preferences={preferences}
            fetchPreferences={fetchPreferences}
          /> */}
          {/* <Agreements /> */}
          {/* <BillingSettings /> */}
          {/* <Verification /> */}
          {
            {
              general: (
                <GeneralSettings modalRef={modalRef} tab={tab} user={user} />
              ),
              password: (
                <GeneralSettings modalRef={modalRef} tab={tab} user={user} />
              ),
              preferences: (
                <PreferenceSettings
                  preferences={preferences}
                  fetchPreferences={fetchPreferences}
                />
              ),
              agreements: <Agreements />,
              billing: <BillingSettings />,
              verification: <Verification />,
              //   kyc: <KYCVerification />,
            }[tab]
          }
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Settings;
