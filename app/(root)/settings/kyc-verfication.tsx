"use client";
import { useGetKyc } from "@/app/hooks/useGetKyc";
import { useVerifyKyc } from "@/app/hooks/useVerifyKyc";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { Veriff } from "@veriff/js-sdk";
import { useEffect } from "react";
import { toast } from "react-toastify";

const KYCVerification = () => {
  //   GET KYC STATUS
  const {
    mutate: getKyc,
    data,
    isPending,
  } = useGetKyc({
    onSuccess: (data) => {
      //
    },
    onError: (error) => {
      //
    },
  });

  //   VERIFY KYC
  const { mutate: verifyKYC } = useVerifyKyc({
    onSuccess: () => {
      getKyc();
      toast.success("KYC verification successful");
    },
    onError: (error: any) => {
      toast.error("Error verifying KYC");
    },
  });

  const startVerification = async () => {
    const veriff = Veriff({
      apiKey: "f2a23a4b-3f75-4d65-a45f-759ec27a18a5",
      parentId: "veriff-root",
      onSession: function (err: any, response: any) {
        // received the response, verification can be started / triggered now

        // redirect
        // window.location.href = response.verification.url;

        // or open in the iframe
        createVeriffFrame({
          url: response.verification.url,
          onEvent: function (msg) {
            switch (msg) {
              case MESSAGES.FINISHED:
                // verification is finished
                verifyKYC();
                break;
            }
          },
        });
      },
    });

    veriff.mount();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getKyc();
    }
  }, []);

  useEffect(() => {
    if (data && !isPending && !data.kycVerified) {
      startVerification();
    }
  }, [data, isPending]);

  return (
    <div className="flex flex-col justify-center items-center">
      {isPending && <div className="text-white">Loading...</div>}

      {!isPending && data && data.kycVerified && (
        <div className="text-white">KYC already verified</div>
      )}

      {!isPending && data && !data.kycVerified && (
        <>
          <h1 className="text-white font-semibold text-lg 2xl:text-xl uppercase text-center w-full">
            Verify Your Identity
          </h1>
          <div
            id="veriff-root"
            className="py-8 [&_p.veriff-description]:!text-white [&_p.veriff-description>a]:!text-blue-500 [&_p.veriff-description>a:hover]:!underline
      [&_input]:!bg-[#292a3a] [&_input]:!text-white [&_.veriff-submit]:!bg-[#1A5B0B] [&_.veriff-submit]:!border-[#52FC18] [&_.veriff-submit]:cursor-pointer [&_.veriff-submit:hover]:!rounded-full
      "
          />
        </>
      )}
    </div>
  );
};

export default KYCVerification;
