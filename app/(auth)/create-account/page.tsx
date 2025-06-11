"use client";
import AccountCheckout from "@/components/shared/AccountCheckout";
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../../public/gofunded/logo.png";
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true); // Open the modal when the route is reached
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className=" w-full flex items-center animate-pulse flex-col justify-center gap-3 h-screen">
        <Image src={logo} alt="logo" width={200} height={150} priority />
        <p className=" text-[1.1rem]  text-vintage-50 font-semibold ">
          Lets Place Some Picks{" "}
        </p>
      </div>
      <AccountCheckout isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default Page;
