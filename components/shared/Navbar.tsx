import { useState, useEffect } from "react";
import { PiBell } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useGetNotifications } from "@/app/hooks/useGetNotifications";
import { LoaderCircle } from "lucide-react";
import { accountStore } from "@/app/store/account";
import { Notification } from "@prisma/client";
import { useMarkNotification } from "@/app/hooks/useMarkNotification";
import toast from "react-hot-toast";

const Navbar = () => {
  const account = accountStore((state) => state.account);
  const { mutate: markAsRead } = useMarkNotification({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error("An error occurred while marking as read");
    },
  });
  const { data, isPending, refetch } = useGetNotifications();
  const [hasUnread, setHasUnread] = useState(false);

  // Web Socket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8443?userId=${account.userId}`);
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onmessage = (msg) => {
      console.log(msg);
      refetch();
    };
    ws.onclose = () => {
      console.log("disconnected");
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    if (
      data.notifications.length > 0 &&
      data.notifications.some(
        (notification: Notification) => !notification.read
      )
    ) {
      setHasUnread(true);
    }
  }, [data]);

  const markNotifications = () => {
    markAsRead({
      onSuccess: () => {
        refetch();
      },
      onError: (error: any) => {
        toast.error("An error occurred while marking as read");
      },
    });
    setHasUnread(false);
  };

  return (
    <div className="  bg-primary  items-center hidden md:flex justify-between px-3 md:px-8 py-3 2xl:py-4 ">
      <div className="inline-flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <PiBell className=" border-t border-gray-600 bg-gray-900 hover:cursor-pointer rounded-md p-1.5 px-2 text-white text-4xl" />
            {!isPending && hasUnread && (
              <>
                <div className="absolute top-0 right-0 mt-1 mr-1 bg-primary-50 text-white text-xs font-bold rounded-full h-2 w-2 flex items-center justify-center" />
                <div className="absolute top-0 right-0 mt-1 mr-1 bg-primary-50 text-white text-xs font-bold rounded-full h-2 w-2 flex items-center justify-center animate-ping" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" md:w-[22rem]  2xl:w-96 max-h-[470px] 2xl:max-h-[540px] z-50 overflow-y-auto  text-white bg-[#272837] mr-8 md:mr-36 border-none py-5 mt-1   rounded-xl  shadow-inner shadow-gray-700">
            <div className=" w-full items-center flex justify-between border-b  border-gray-700  pb-4 mb-2">
              <h3 className=" text-lg font-bold px-3.5">Notifications</h3>
              <button
                className=" text-sm inline-flex gap-1 items-center font-bold text-primary-50 px-3.5"
                onClick={markNotifications}
              >
                <Image
                  src="/icons/mark-as-read.svg"
                  alt="Mark All"
                  width={16}
                  height={16}
                />
                Mark read
              </button>
            </div>

            {isPending && (
              <div className="flex hover:bg-[#333547]/20 items-center justify-start my-4 py-3 px-3.5">
                <LoaderCircle className="animate-spin" />
                Loading...
              </div>
            )}

            {!isPending && data.notifications?.length === 0 && (
              <div className="flex hover:bg-[#333547]/20 items-center justify-start my-4 py-3 px-3.5">
                <Image
                  src="/images/notification.svg"
                  alt="Client"
                  width={50}
                  height={50}
                />
                <div className="flex flex-col ml-3">
                  <p className="font-bold">No new notifications</p>
                </div>
              </div>
            )}

            {!isPending &&
              data.notifications?.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className="flex hover:bg-[#333547]/20 items-center justify-start my-4 py-3 px-3.5"
                >
                  <Image
                    src="/icons/marked.png"
                    alt="Client"
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col ml-3">
                    <p className="font-bold">{notification.content}</p>
                    <span className=" text-sm text-slate-400/60">
                      {new Date(notification.createdAt).toUTCString()}
                    </span>
                  </div>
                </div>
              ))}

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          href={"/user/profile"}
          className=" border-t border-gray-600 bg-gray-900 hover:cursor-pointer rounded-md p-1.5 px-2 text-white text-4xl"
        >
          <Image
            src="/icons/profile.svg"
            alt="User Avatar"
            width={20}
            height={20}
            className="rounded-full hover:cursor-pointer"
          />
        </Link>
        <Link
          href={"/settings"}
          className=" border-t border-gray-600 bg-gray-900 hover:cursor-pointer rounded-md p-1.5 px-2 text-white text-4xl"
        >
          <Image
            src="/icons/setting.svg"
            alt="User Avatar"
            width={20}
            height={20}
            className="rounded-full hover:cursor-pointer"
          />
        </Link>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src="/images/avatar.svg"
              alt="User Avatar"
              width={35}
              height={35}
              className="rounded-full hover:cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" mr-12 mt-1 p-5 py-6 gap-3 bg-white rounded-none shadow w-72 flex items-center justify-between">
            <Image
              src="/images/avatar.svg"
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col mr-3">
              <p className=" font-semibold ">Lex Caton</p>
              <span className=" text-sm text-slate-400">lexaCatonOwner</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <button className="">
                <IoSettingsOutline className=" text-2xl text-primary-50" />
              </button>
              <button className="">
                <TbLogout className=" text-2xl text-red-500" />
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default Navbar;
