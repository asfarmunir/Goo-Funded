"use client";
import Navbar from "@/components/shared/Navbar";
import { tabs } from "@/lib/constants";
import Image from "next/image";
import React from "react";
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

const page = () => {
  const [tab, setTab] = useState<string>("profile");

  const changeTab = (tab: string) => {
    setTab(tab);
  };
  return (
    <>
      <div
        className=" hidden md:block sticky 
        top-0
        z-50
        w-full
        "
      >
        <div className=" w-[99%] bg-primary justify-between flex items-center absolute">
          <h1 className=" ml-4  text-white inline-flex items-center gap-2 font-thin 2xl:text-lg">
            <Image src="/icons/help.png" alt="Logo" width={20} height={20} />
            HELP
          </h1>
          <Navbar />
        </div>
      </div>
      <div className=" w-full  flex  text-white mt-1 md:mt-9 gap-4 p-5 md:p-8 pb-24 max-h-full overflow-auto">
        <div className=" w-full  md:w-[70%] h-full shadow-inner shadow-gray-800 flex flex-col gap-4 bg-[#181926] p-4 md:p-6 rounded-xl">
          <div className=" w-full items-center flex justify-between">
            <h2 className=" text-2xl w-full font-bold text-white tracking-wider">
              HELP
            </h2>
          </div>
          <div className=" w-full flex flex-col space-y-5  py-6  md:p-3  rounded-2xl 2xl:p-5  mb-8 ">
            <div className=" bg-[#272837] shadow-inner shadow-gray-700 p-3  md:p-6 item-center  overflow-hidden relative items-center rounded-2xl w-full  flex  justify-between gap-3 ">
              <div className="flex items-center ">
                <div className="w-12 h-12 rounded-xl mr-2.5 bg-gray-700"></div>
                <div className=" flex flex-col  gap-1">
                  <h2 className=" text-sm md:text-base font-bold">
                    VIDEO TITLE
                  </h2>
                  <p className="  text-xs md:text-sm 2xl:text-base text-[#848BAC] ">
                    This is the short description of the video
                  </p>
                </div>
              </div>
              <Image
                src="/icons/play.png"
                alt="Video"
                width={23}
                height={23}
                className=""
              />
            </div>
            <div className=" bg-[#272837] shadow-inner shadow-gray-700 p-3  md:p-6 item-center  overflow-hidden relative items-center rounded-2xl w-full  flex  justify-between gap-3 ">
              <div className="flex items-center ">
                <div className="w-12 h-12 rounded-xl mr-2.5 bg-gray-700"></div>
                <div className=" flex flex-col  gap-1">
                  <h2 className=" text-sm md:text-base font-bold">
                    VIDEO TITLE
                  </h2>
                  <p className="  text-xs md:text-sm 2xl:text-base text-[#848BAC] ">
                    This is the short description of the video
                  </p>
                </div>
              </div>
              <Image
                src="/icons/play.png"
                alt="Video"
                width={23}
                height={23}
                className=""
              />
            </div>
            <div className=" bg-[#272837] shadow-inner shadow-gray-700 p-3  md:p-6 item-center  overflow-hidden relative items-center rounded-2xl w-full  flex  justify-between gap-3 ">
              <div className="flex items-center ">
                <div className="w-12 h-12 rounded-xl mr-2.5 bg-gray-700"></div>
                <div className=" flex flex-col  gap-1">
                  <h2 className=" text-sm md:text-base font-bold">
                    VIDEO TITLE
                  </h2>
                  <p className="  text-xs md:text-sm 2xl:text-base text-[#848BAC] ">
                    This is the short description of the video
                  </p>
                </div>
              </div>
              <Image
                src="/icons/play.png"
                alt="Video"
                width={23}
                height={23}
                className=""
              />
            </div>

            <a
              href="https://intercom.help/vantage-picks/en"
              target="_blank"
              className=" bg-[#272837] shadow-inner shadow-gray-700 p-3  md:p-6 item-center  overflow-hidden relative items-center rounded-2xl w-full  flex  justify-between gap-3 "
            >
              <span className=" flex flex-col  gap-1">
                <span className=" text-sm md:text-xl font-bold">
                  FAQs AND HELP CENTER
                </span>
              </span>
              <Image
                src="/icons/right.png"
                alt="Video"
                width={23}
                height={23}
                className=""
              />
            </a>
            <div className=" bg-[#272837] shadow-inner shadow-gray-700 p-3  md:p-6 item-center  overflow-hidden relative items-center rounded-2xl w-full  flex   gap-2.5 ">
              <Image
                src="/icons/email.png"
                alt="Video"
                width={22}
                height={22}
                className=""
              />
              <h2 className="  uppercase text-xs md:text-base font-bold">
                Contact:{" "}
                <a
                  href="mailto:support@vantagepicks.com"
                  className="text-[#848BAC] hover:underline"
                >
                  support@vantagepicks.com
                </a>
              </h2>
            </div>
          </div>{" "}
        </div>
        <div className=" hidden md:block md:w-[30%]  ">
          <Image
            src="/images/profile-hero.png"
            alt="Ads"
            width={470}
            priority
            height={450}
            className=" rounded-lg  
             h-full w-full
            
              "
          />
        </div>
      </div>
    </>
  );
};

export default page;
