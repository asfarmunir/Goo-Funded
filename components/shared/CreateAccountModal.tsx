import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function CreateAccountModal() {
  const pathname = usePathname();

  return (
    (pathname === "/dashboard" || pathname === "/picks") && (
      <div className="absolute w-full inset-0 flex justify-center  items-start pt-16  backdrop-blur-sm bg-black/50 z-50">
        <div
          className="text-white flex  flex-col justify-end items-center relative border-none p-8 md:pb-10 overflow-hidden min-h-[75svh] 2xl:min-h-[80svh] rounded-2xl w-[95%] md:w-[30%] max-w-screen-xl bg-primary-100  gap-3 [&_button:has(svg)]:hidden"
          style={{
            backgroundImage: "url('/vintage/images/2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Link
            href={"/"}
            className="
          absolute top-4 right-4"
          >
            <IoClose className="text-lg" />
          </Link>
          <h1 className="text-xl 2xl:text-2xl font-bold text-vintage-50 text-pretty">
            BET SPORTS WITH OUR
          </h1>

          <p className=" text-slate-700 mb-3 mt-4 md:mt-0 2xl:text-base text-center text-sm">
            Maximize your earnings with minimal risk. Bet confidently using our
            capital and unlock higher rewards!{" "}
          </p>
          <Link
            href={"/create-account"}
            className="text-white  bg-vintage-50 w-full text-center font-semibold text-sm rounded-full px-6 py-3  gap-3 hover:opacity-75"
          >
            Add Account
          </Link>
        </div>
      </div>
    )
  );
}
