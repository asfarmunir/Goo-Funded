"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export default function TwoFactorAuthPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [twofactorsecret, settwofactorsecret] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };
  const fetchQRCode = async () => {
    try {
      const res = await axios.get("/api/auth/generate-qrcode");
      setQrUrl(res.data.qrcode);
      settwofactorsecret(res.data.twofactorsecret);
    } catch (error) {
      toast.error("Failed to fetch QR code");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/verify-otp", {
        token: code,
        twoFa: twofactorsecret,
      });
      if (res.data.verified === true) {
        router.push("/");
      } else {
        toast.error("verificatoin failed!");
      }
    } catch (error) {
      toast.error("Failed to verify QR code");
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  return (
    <>
      {status === "authenticated" && (
        <div className=" bg-[#181926] w-full mx-auto items-center shadow-inner shadow-slate-800  justify-center sm:w-fit sm:min-w-[459px] 2xl:mt-10 2xl:min-w-[500px] mt-32 md:mt-6 flex flex-col  rounded-lg p-7 px-[2.18rem]    2xl:p-10 ">
          <h2 className=" text-xl md:text-2xl 2xl:text-3xl pb-3 w-full text-center font-bold text-white">
            Two-Factor Authentication{" "}
          </h2>
          <h2 className=" text-base md:text-lg border-b pb-3 w-full mb-5 text-center border-slate-700 font-bold text-slate-400 2xl:mb-2">
            This is the last step. Use Google Authenticator.{" "}
          </h2>
          <div
            style={{ marginBottom: "20px" }}
            className=" border p-3 rounded-lg border-slate-800"
          >
            <img
              src={qrUrl}
              alt="QR Code"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className=" w-full"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Input
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="  focus:ring-green-600/50 border border-slate-800   text-center focus:ring-1 outline-offset-1  shadow  focus:border   rounded-lg bg-[#333547]/60 w-full p-4  2xl:py-6 2xl:px-6 text-[#848BAC] leading-tight "
            />
            <button
              type="submit"
              className="bg-[#333547] mb-4 inner-shadow border border-[#28B601] w-full rounded-xl hover:bg-slate-600 mt-4 text-white font-semibold p-3.5  2xl:py-6 2xl:text-lg   focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}
