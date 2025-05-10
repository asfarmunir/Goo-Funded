"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navlinks } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { userStore } from "@/app/store/user";
import { useGetUser } from "@/app/hooks/useGetUser";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const user = userStore((state) => state.user);

  return (
    <>
      <div
        className={`relative bg-primary border-r border-gray-800 h-full  transition-all duration-300 
          ${isCollapsed ? "w-[5%] lg:w-[6%]" : "w-[22%] ease-in-out 2xl:w-[24%]"
          } 
          min-h-screen hidden lg:flex flex-col gap-7 2xl:gap-10 p-4`}
      >
        <Image
          src={!isCollapsed ? "/images/logo.svg" : "/icons/logo.png"}
          alt="logo"
          width={170}
          height={170}
          className={` ${isCollapsed && "w-[30px] h-[30px] mx-auto"} `}
          priority
        />
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <Image
              src="/images/hello.png"
              alt="Client"
              width={46}
              height={46}
              className="2xl:w-14 2xl:h-14"
            />
            <div className="flex flex-col">
              <p className="text-[#848BAC] font-bold text-xs 2xl:text-base mb-1 ">
                Welcome Back!
              </p>
              <h3 className="text-lg 2xl:text-2xl font-bold text-white">

                {`${user.firstName} ${user.lastName}`}

              </h3>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {navlinks.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={`inline-flex  font-bold uppercase text-sm  2xl:text-lg 
                ${pathname === link.link
                  ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                  : "text-[#848BAC] p-3 2xl:p-4  rounded-lg hover:bg-[#27283197]"
                }
                items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}
            >
              <Image
                src={
                  pathname === link.link ? link.icons[0].src : link.icons[1].src
                }
                alt="icon"
                width={16}
                className="2xl:w-[20px]"
                height={16}
                priority
              />
              {!isCollapsed && link.title}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-5 w-[85%] flex-col flex">
          <Link
            href={"/create-account"}
            className={`inline-flex   font-bold uppercase text-sm  2xl:text-lg 
              ${isCollapsed ? " ml-0.5 w-fit" : "w-full"}
                ${pathname === "/create-account"
                ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                : "text-[#848BAC] p-3 2xl:p-4  rounded-2xl hover:bg-[#27283197]"
              }
                items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}
          >
            <Image
              src="/icons/add.png"
              alt="Arrow Icon"
              width={20}
              height={20}
            />
            {!isCollapsed && <p>ADD ACCOUNT</p>}
          </Link>
          <Link
            href={"/help"}
            className={`inline-flex   font-bold uppercase text-sm  2xl:text-lg 
              ${isCollapsed ? " ml-0.5 w-fit" : "w-full"}
                ${pathname === "/help"
                ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                : "text-[#848BAC] p-3 2xl:p-4  rounded-2xl hover:bg-[#27283197]"
              }
                items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}
          >
            <Image
              src={pathname === "/help" ? "/icons/help.png" : "/icons/help.svg"}
              alt="Help"
              width={16}
              className="2xl:w-[20px]"
              height={16}
              priority
            />
            {!isCollapsed && <p>HELP</p>}
          </Link>
          <button
            onClick={handleCollapseToggle}
            className={`inline-flex uppercase font-bold text-sm 2xl:text-lg text-[#848BAC] px-3 2xl:px-4 p-2 items-center gap-2`}
          >
            <Image
              src={"/icons/collapse.svg"}
              alt={isCollapsed ? "Expand" : "Collapse"}
              width={16}
              className={` ${isCollapsed && " rotate-180"
                } transition-all duration-500 2xl:w-[20px]`}
              height={16}
              priority
            />
            {!isCollapsed && "Collapse"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
