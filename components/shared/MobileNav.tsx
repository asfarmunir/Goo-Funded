"use client";
import { userStore } from "@/app/store/user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navlinks } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu } from "react-icons/hi";
const MobileNav = () => {
  const pathname = usePathname();
  const user = userStore((state) => state.user);
  return (
    <div className=" w-full  bg-vintage-50  flex md:hidden items-center justify-between px-3.5 py-4">
      <Image src="/images/logo.svg" alt="Logo" width={160} height={160} />
      <Sheet>
        <SheetTrigger className=" block  lg:hidden">
          <HiMenu className=" text-white text-3xl" />
        </SheetTrigger>
        <SheetContent className="  bg-vintage-50 text-white py-7 px-4 border-none">
          <SheetHeader>
            <div className=" relative h-full min-h-screen flex flex-col items-start gap-7">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={200}
                height={200}
                className=" w-[150px] 2xl:w-[200px] "
              />
              <div className="flex  gap-3">
                <Image
                  src="/images/hello.png"
                  alt="Client"
                  width={46}
                  height={46}
                  className="2xl:w-14 2xl:h-14"
                />
                <div className="flex items-start flex-col">
                  <p className="text-[#848BAC] font-semibold text-xs 2xl:text-base mb-1 2xl:mb-2">
                    Welcome Back!
                  </p>
                  <h3 className="text-lg 2xl:text-xl font-bold text-white">
                    {`${user?.firstName} ${user?.lastName}`}
                  </h3>
                </div>
              </div>
              {navlinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.link}
                  className={`inline-flex w-full  font-bold uppercase text-sm  2xl:text-lg 
                ${
                  pathname === link.link
                    ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                    : "text-[#848BAC] px-3 2xl:px-4 p-2 rounded-lg hover:bg-[#27283197]"
                }
                items-center gap-2 `}
                >
                  <Image
                    src={
                      pathname === link.link
                        ? link.icons[0].src
                        : link.icons[1].src
                    }
                    alt="icon"
                    width={16}
                    className="2xl:w-[20px]"
                    height={16}
                    priority
                  />
                  {link.title}
                </Link>
              ))}
              <div className="absolute bottom-14  w-full  gap-7 flex-col flex">
                <Link
                  href={"/settings"}
                  className={`inline-flex  font-bold uppercase text-sm  2xl:text-lg 
                ${
                  pathname === "/settings"
                    ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                    : "text-[#848BAC] p-3 2xl:p-4  rounded-lg hover:bg-[#27283197]"
                }
                items-center gap-2 `}
                >
                  <Image
                    src={
                      pathname === "/settings"
                        ? "/icons/setting.svg"
                        : "/icons/setting.svg"
                    }
                    alt="Help"
                    width={16}
                    className="2xl:w-[20px]"
                    height={16}
                    priority
                  />
                  <p>SETTINGS</p>
                </Link>
                <Link
                  href={"/user/profile"}
                  className={`inline-flex  font-bold uppercase text-sm  2xl:text-lg 
                ${
                  pathname === "/user/profile"
                    ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                    : "text-[#848BAC] p-3 2xl:p-4  rounded-lg hover:bg-[#27283197]"
                }
                items-center gap-2 `}
                >
                  <Image
                    src={
                      pathname === "/user/profile"
                        ? "/icons/profile.svg"
                        : "/icons/profile.svg"
                    }
                    alt="Help"
                    width={16}
                    className="2xl:w-[20px]"
                    height={16}
                    priority
                  />
                  <p>PROFILE</p>
                </Link>
                <Link
                  href={"/help"}
                  className={`inline-flex  font-bold uppercase text-sm  2xl:text-lg 
                ${
                  pathname === "/help"
                    ? "text-white inner-left-shadow p-3 2xl:p-4 bg-[#181926] rounded-2xl"
                    : "text-[#848BAC] p-3 2xl:p-4  rounded-lg hover:bg-[#27283197]"
                }
                items-center gap-2 `}
                >
                  <Image
                    src={
                      pathname === "/help"
                        ? "/icons/help.png"
                        : "/icons/help.svg"
                    }
                    alt="Help"
                    width={16}
                    className="2xl:w-[20px]"
                    height={16}
                    priority
                  />
                  <p>HELP</p>
                </Link>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
