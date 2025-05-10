"use client";

import Image from "next/image";
import { Switch } from "../ui/switch";
import { useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaAngleDown } from "react-icons/fa6";
import { toast } from "react-hot-toast";

const PreferenceSettings = ({
  preferences,
  fetchPreferences,
}: {
  preferences: any;
  fetchPreferences: () => void;
}) => {
  const [displayStatsLive, setDisplayStatsLive] = useState(
    preferences?.displayStatsLive || false
  );
  const [phoneNotification, setPhoneNotification] = useState(
    preferences?.phoneNotification || false
  );
  const [emailNotification, setEmailNotification] = useState(
    preferences?.emailNotification || false
  );

  const handleToggleChange = async (field: any, checked: boolean) => {
    try {
      const response = await axios.patch("/api/preferences", {
        field,
        value: checked,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update preferences");
      }

      toast.success("Preferences updated successfully:", response.data);
      fetchPreferences();
    } catch (error) {
      toast.error("Error updating preferences");
    }
  };

  return (
    <div className=" w-full flex text-vintage-50 flex-col gap-4">
      <h2 className="text-lg 2xl:text-xl font-semibold text-vintage-50">
        Personal Information
      </h2>
      <p className="text-sm 2xl:text-base -mt-4 mb-2.5 text-gray-700">
        Update your personal information
      </p>
      <div className=" w-full flex justify-between py-4  pb-8 gap-3  bg-[#EFEFF1] p-4 rounded-2xl  border ">
        <div className="flex flex-col gap-1">
          <h3 className=" text-lg  font-bold">Display Stats Live</h3>

          <p className="text-sm text-[#848BAC] tracking-wide ">
            Display your stats online publicly.
          </p>
        </div>
        <Switch
          checked={displayStatsLive}
          onChange={(checked: any): any => {
            setDisplayStatsLive(checked);
            handleToggleChange("displayStatsLive", checked);
          }}
          onClick={(e) => {
            const switch_ = e.target as HTMLButtonElement;
            const toggle = switch_.getAttribute("data-state");
            handleToggleChange("displayStatsLive", toggle !== "checked");
            setDisplayStatsLive(!displayStatsLive);
          }}
        />
      </div>
      {/* <div className=" w-full flex justify-between py-4  pb-8 gap-3  bg-[#EFEFF1] p-4 rounded-2xl  border ">
        <div className="flex flex-col gap-1">
          <h3 className=" text-lg  font-bold">Phone Notifications</h3>

          <p className="text-sm text-[#848BAC] tracking-wide ">
            Toggle whether you want to receive phone notifications.
          </p>
        </div>
        <Switch
          checked={phoneNotification}
          onChange={(checked: any): any => {
            setPhoneNotification(checked);
            handleToggleChange("phoneNotification", checked);
          }}
          onClick={(e) => {
            const switch_ = e.target as HTMLButtonElement;
            const toggle = switch_.getAttribute("data-state");
            handleToggleChange("phoneNotification", toggle !== "checked");
            setPhoneNotification(!phoneNotification);
          }}
        />
      </div> */}
      <div className=" w-full flex justify-between py-4  pb-8 gap-3  bg-[#EFEFF1] p-4 rounded-2xl  border">
        <div className="flex flex-col gap-1">
          <h3 className=" text-lg  font-bold">Email Notifications</h3>

          <p className="text-sm text-[#848BAC] tracking-wide max-w-md ">
            Toggle whether you want to receive email notifications.
          </p>
        </div>
        <Switch
          checked={emailNotification}
          onChange={(checked: any): any => {
            setDisplayStatsLive(checked);
            handleToggleChange("displayStatsLive", checked);
          }}
          onClick={(e) => {
            const switch_ = e.target as HTMLButtonElement;
            const toggle = switch_.getAttribute("data-state");
            handleToggleChange("emailNotification", toggle !== "checked");
            setEmailNotification(!emailNotification);
          }}
        />
      </div>
      {/* <div className=" w-full flex justify-between py-4  ">
        <div className="flex flex-col gap-1">
          <h3 className=" text-lg  font-bold">ODDS DISPLAY</h3>

          <p className="text-sm text-[#848BAC] tracking-wide max-w-md ">
            Toggle to display moneyline or odds.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className=" bg-[#393C53]  font-bold   justify-center w-full text-sm 2xl:text-base md:w-fit  px-4  rounded-xl inline-flex items-center gap-2">
            <Image
              src="/icons/odds.png"
              alt="Arrow Icon"
              width={18}
              height={18}
            />
            <span className="text-[#737897] ">Odds:</span>
            AMERICAN
            <FaAngleDown className=" text-lg ml-0.5 mb-0.5 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48  bg-[#181926] text-vintage-50 border-none  mt-1  p-3 rounded-lg text-xs 2xl:text-base">
            <DropdownMenuItem className="flex items-center justify-between ">
              <p> ITEMS</p>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center justify-between ">
              <p>FUNDED</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-between ">
              <p> ITEMS</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </div> */}
    </div>
  );
};

export default PreferenceSettings;
