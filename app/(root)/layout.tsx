"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { accountStore } from "../store/account";
import { useGetUser } from "../hooks/useGetUser";
import { userStore } from "../store/user";
import { Account } from "@prisma/client";
import CreateAccountModal from "@/components/shared/CreateAccountModal";
import Intercom from "@intercom/messenger-js-sdk";
import logo from "@/public/goFunded/logo.png";
import Nav from "@/components/shared/Nav";
const layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();

  // User Details
  const { data: user, isPending: loadingUser } = useGetUser();
  const updateUser = userStore((state) => state.setUser);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (!loadingUser && user) {
      updateUser(user.user);
    }
  }, [loadingUser, user, updateUser]);

  // Account store
  const updateAccount = accountStore((state) => state.setAccount);

  // User Account
  const { data: accounts, isPending } = useGetAccounts();
  const [hasAccount, setHasAccount] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    if (accounts && !isPending) {
      const previousAccountId = localStorage.getItem("account");
      const previousAccount = accounts.find(
        (account: Account) => account.id === previousAccountId
      );
      updateAccount(previousAccount || accounts[0]);
    }
    if (
      !isPending &&
      accounts.length === 0 &&
      !(pathname === "/user/profile" || pathname.split("?")[0] === "/settings")
    ) {
      setHasAccount(false);
    }
  }, [accounts, isPending, pathname]);

  var APP_ID = "u765e7qk";

  Intercom({
    app_id: APP_ID,
    alignment: "right",
    horizontal_padding: 40,
    vertical_padding: 20,
  });

  return (
    <>
      <main className={` flex bg-vintage-default relative `}>
        {status === "authenticated" && (
          <>
            {/* <Sidebar /> */}
            <main className="flex relative flex-col  overflow-x-hidden  items-start   w-full">
              <div
                className=" block sticky 
        top-0
        z-50
        w-full
        px-3
        "
              >
                <Nav />
              </div>
              {!hasAccount && <CreateAccountModal />}
              <section className="  min-h-svh  w-full py-2.5 px-3 relative">
                {children}
              </section>
            </main>
          </>
        )}
        {status === "loading" && (
          <div className=" w-full flex items-center animate-pulse flex-col justify-center gap-3 h-screen">
            <Image src={logo} alt="logo" width={200} height={150} priority />
            <p className=" text-[1.1rem]  text-vintage-50 font-semibold ">
              Lets Place Some Picks{" "}
            </p>
          </div>
        )}
        <Link href={"https://proppicks.com/"} target="_blank">
          <Image
            src="/images/propicks.svg"
            alt="bg"
            width={150}
            height={150}
            className="absolute bottom-6 left-6 z-50 2xl:w-[200px] "
          />
        </Link>
      </main>
    </>
  );
};

export default layout;
