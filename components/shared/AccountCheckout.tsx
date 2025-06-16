"use client";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
// import { AuthOptions } from "@/app/api/auth/AuthOptions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { MdOutlineClose } from "react-icons/md";
import toast from "react-hot-toast";

interface Steps {
  title: string;
  price: string;
}

const two_step: Steps[] = [
  {
    title: "1K",
    price: "$49",
  },
  {
    title: "2K",
    price: "$76",
  },
  {
    title: "5K",
    price: "$167",
  },
  {
    title: "10K",
    price: "$324",
  },
  {
    title: "20K",
    price: "$503",
  },
  {
    title: "50K",
    price: "$1119",
  },
];

const three_step: Steps[] = [
  {
    title: "2K",
    price: "$40",
  },
  {
    title: "5K",
    price: "$76",
  },
  {
    title: "10K",
    price: "$156",
  },
  {
    title: "20K",
    price: "$312",
  },
];

interface AccountCheckoutProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AccountCheckout: React.FC<AccountCheckoutProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [coupen, setCoupen] = useState<string>("");
  const [coupenApplied, setCoupenApplied] = useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }

    // clear billing address
    localStorage.removeItem("billing");
    localStorage.removeItem("step");
  }, [status, router]);

  // account sizes
  const [activeStep, setActiveStep] = useState<number>(2);
  const [accountSizes, setAccountSizes] = useState<Steps[]>(two_step);
  const [activeAccountSize, setActiveAccountSize] = useState<Steps>(
    two_step[0]
  );
  console.log("🚀 ~ activeAccountSize:", activeAccountSize);

  const changeActiveStep = (step: number) => {
    setActiveStep(step);
    if (step === 2) {
      setAccountSizes(two_step);
      setActiveAccountSize(two_step[0]);
    } else if (step === 3) {
      setAccountSizes(three_step);
      setActiveAccountSize(three_step[0]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  // form
  const openForm = () => {
    router.push(
      `/create-account/form/?type=${activeStep}&accountSize=${activeAccountSize.title}&price=${activeAccountSize.price}`
    );
  };

  const applyCoupon = () => {
    console.log("apply coupon");

    if (coupen === "BARKLEY90") {
      // Extract the numeric value from the price string
      const originalPrice = parseFloat(
        activeAccountSize.price.replace("$", "")
      );

      // Apply 90% discount
      const discountedPrice = originalPrice * 0.1; // 10% of the original price (90% discount)

      // Update the activeAccountSize state with the revised price
      setActiveAccountSize({
        ...activeAccountSize,
        price: `$${discountedPrice.toFixed(0)}`, // Format the price as a string with 2 decimal places
      });

      // Optionally, you can show a success message or toast notification
      setCoupenApplied(true);
      toast.success("Coupon code applied successfully");
    } else if (coupen === "VP30") {
      // Extract the numeric value from the price string
      const originalPrice = parseFloat(
        activeAccountSize.price.replace("$", "")
      );

      // Apply 90% discount
      const discountedPrice = originalPrice * 0.7; // 70% of the original price (30% discount)

      // Update the activeAccountSize state with the revised price
      setActiveAccountSize({
        ...activeAccountSize,
        price: `$${discountedPrice.toFixed(0)}`, // Format the price as a string with 2 decimal places
      });

      // Optionally, you can show a success message or toast notification
      setCoupenApplied(true);
      toast.success("Coupon code applied successfully");
    } else if (coupen === "LAUNCH50") {
      // Extract the numeric value from the price string
      const originalPrice = parseFloat(
        activeAccountSize.price.replace("$", "")
      );

      // Apply 90% discount
      const discountedPrice = originalPrice * 0.5; // 50% of the original price (50% discount)

      // Update the activeAccountSize state with the revised price
      setActiveAccountSize({
        ...activeAccountSize,
        price: `$${discountedPrice.toFixed(0)}`, // Format the price as a string with 2 decimal places
      });

      // Optionally, you can show a success message or toast notification
      setCoupenApplied(true);
      toast.success("Coupon code applied successfully");
    } else {
      setCoupen("");
      setCoupenApplied(false);
      toast.error("Invalid coupon code");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className=" rounded-2xl overflow-hidden md:min-w-[1100px] [scrollbar-width:none] 2xl:min-w-[1300px] h-[95svh] overflow-y-auto p-0">
        <div className=" w-full bg-[#F2F2F2] p-4 2xl:p-6 relative">
          <h2 className="text-vintage-50 text-xl font-bold 2xl:text-2xl">
            Create Account
          </h2>
          <button
            onClick={handleClose}
            className=" absolute right-4 top-4 text-black"
          >
            <MdOutlineClose className=" text-2xl" />
          </button>
        </div>

        {status === "authenticated" && (
          <section className=" w-full flex px-4 md:px-6 gap-6 flex-col md:flex-row pb-8 ">
            <div className="flex flex-col gap-4  w-full md:max-w-[60%]">
              <h2 className=" text-xl md:text-2xl font-bold text-vintage-50 ">
                Sports Challenge
              </h2>
              <p className=" text-[#848BAC] -mt-2  ">
                Get funded and earn up to 70% of your picking profits.-{" "}
              </p>
              <div className=" w-full bg-[#428BC1]  flex flex-col md:flex-row md:items-center gap-6 px-5 py-5 rounded-3xl ">
                <div className="flex bg-white justify-center w-full rounded-full items-center py-3 text-vintage-50 ">
                  <p className=" italic tracking-[-0.08rem] text-sm  2xl:text-base font-black">
                    TAKE YOUR CHALLENGE
                  </p>
                </div>
                <div className="flex bg-white justify-center w-full rounded-full items-center py-3 text-vintage-50 ">
                  <p className=" italic tracking-[-0.08rem] text-sm  2xl:text-base font-black">
                    UNLOCK CAPITAL
                  </p>
                </div>
                <div className="flex bg-white justify-center w-full rounded-full items-center py-3 text-vintage-50 ">
                  <p className=" italic tracking-[-0.08rem] text-sm  2xl:text-base font-black">
                    START PICKING
                  </p>
                </div>
              </div>
              <div className=" w-full bg-[#F8F8F8]  flex flex-col gap-2 px-8 py-5 rounded-2xl    ">
                <h2 className="text-lg 2xl:text-xl font-bold ">
                  {" "}
                  Choose Your Challenge Type
                </h2>

                <div className="flex items-center w-full flex-col md:flex-row mt-10  gap-5 md:mt-4">
                  {/* <div
                    className={`text-2xl relative w-full md:w-fit flex justify-center hover:bg-[#1A5B0B] border-2 border-gray-800 cursor-pointer hover:border-2 hover:border-[#52FC18] font-bold px-8 py-2.5 rounded-full ${
                      activeStep === 2
                        ? "bg-[#1A5B0B] border-2 !border-[#52FC18]"
                        : ""
                    }`}
                    onClick={() => changeActiveStep(2)}
                  >
                    2 STEP
                    <Image
                      src="/images/faster.png"
                      alt="2 step"
                      width={70}
                      height={70}
                      className=" absolute -top-2.5"
                    />
                  </div> */}
                  <div
                    className={` ${
                      activeStep === 2 ? "bg-[#001E451A]" : "bg-white"
                    } w-full p-4 2xl:p-5 rounded-2xl border-[#001E451A] flex items-center justify-between gap-4`}
                  >
                    <div>
                      <h2 className="text-base 2xl:text-lg mb-2 text-vintage-50 font-semibold">
                        Two-step Challenge
                      </h2>
                      <p className="text-slate-600 text-xs 2xl:text-sm">
                        Faster qualification process
                      </p>
                    </div>
                    <Checkbox
                      checked={activeStep === 2}
                      className=" bg-slate-100 border border-slate-300 rounded-full w-9 h-9"
                      onCheckedChange={() => {
                        console.log("checked");
                        changeActiveStep(2);
                        setCoupenApplied(false);
                        setCoupen("");
                      }}
                    />
                  </div>
                  <div
                    className={` ${
                      activeStep === 3 ? "bg-[#001E451A]" : "bg-white"
                    } w-full p-4 2xl:p-5 rounded-2xl border-[#001E451A] flex items-center justify-between gap-4`}
                  >
                    <div>
                      <h2 className="text-base 2xl:text-lg mb-2 text-vintage-50 font-semibold">
                        Three-step Challenge
                      </h2>
                      <p className="text-slate-600 text-xs 2xl:text-sm">
                        Faster qualification process
                      </p>
                    </div>
                    <Checkbox
                      checked={activeStep === 3}
                      className=" bg-slate-100 border border-slate-300 rounded-full w-9 h-9"
                      onCheckedChange={() => {
                        changeActiveStep(3);
                        setCoupenApplied(false);
                        setCoupen("");
                      }}
                    />
                  </div>
                  {/* <div
                    className={`text-2xl relative w-full md:w-fit flex items-center justify-center  hover:bg-[#1A5B0B] border-2 border-gray-800 cursor-pointer hover:border-2 hover:border-[#52FC18] font-bold px-8 py-2.5 rounded-full ${
                      activeStep === 3
                        ? "bg-[#1A5B0B] border-2 !border-[#52FC18]"
                        : ""
                    }`}
                    onClick={() => changeActiveStep(3)}
                  >
                    3 STEP
                    <Image
                      src="/images/cheaper.png"
                      alt="3 step"
                      width={70}
                      height={70}
                      className=" absolute -top-2.5"
                    />
                  </div> */}
                </div>
              </div>
              <div className=" w-full bg-[#F8F8F8]  flex flex-col gap-2 px-8 py-5 rounded-2xl    ">
                <h2 className="text-lg 2xl:text-xl font-bold ">
                  {" "}
                  Account Size
                </h2>
                <div className="flex items-center  flex-wrap  mt-10 w-full  gap-3 md:mt-4">
                  {accountSizes.map((item, index) => (
                    <div
                      key={index}
                      className={` ${
                        activeAccountSize.title === item.title
                          ? "bg-[#001E451A]"
                          : "bg-white"
                      } w-full md:w-[200px] p-4 2xl:p-5 rounded-2xl border-[#001e4545] flex items-center justify-between gap-4`}
                    >
                      <h2 className="text-base 2xl:text-lg  text-vintage-50 font-semibold">
                        ${item.title.replace("K", "000")}
                      </h2>
                      <Checkbox
                        checked={activeAccountSize.title === item.title}
                        className=" bg-slate-100 border border-slate-300 rounded-full w-9 h-9"
                        onCheckedChange={() => {
                          setActiveAccountSize(item);
                          setCoupenApplied(false);
                          setCoupen("");
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col  gap-3  w-full md:max-w-[40%]">
              <div className=" bg-[#F8F8F8] p-5 2xl:p-6 rounded-2xl border border-[#001E451A]">
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center border-b pb-6 border-slate-300 justify-between">
                  <div>
                    <h2 className=" text-lg md:text-xl font-bold ">
                      Refundable Fee
                    </h2>
                    <p className="text-sm text-gray-700">
                      for ${activeAccountSize.title} account
                    </p>
                  </div>
                  {/* <p className=" bg-[#001E451F] text-xs 2xl:text-sm border border-[#001E453D] rounded-xl p-3">
                    20% OFF Summer Sale. Ending Friday
                  </p> */}
                </div>
                <div className=" flex flex-col gap-3 border-b py-6 border-slate-300 ">
                  <h2 className=" inline-flex text-sm 2xl:text-base font-semibold items-center gap-2">
                    <Image
                      src="/vintage/images/check.svg"
                      alt="line"
                      width={25}
                      height={25}
                      className=""
                    />
                    One time fee
                  </h2>
                  <h2 className=" inline-flex text-sm 2xl:text-base font-semibold items-center gap-2">
                    <Image
                      src="/vintage/images/check.svg"
                      alt="line"
                      width={25}
                      height={25}
                      className=""
                    />
                    100% Refundable fee with payout
                  </h2>
                </div>
                <div className=" flex flex-col gap-3  py-6  ">
                  {/* <div className="flex items-center justify-between">
                    <h2 className="font-semibold">original Price</h2>
                    <p className=" font-semibold">
                      {" "}
                      $
                      {(
                        parseInt(activeAccountSize.price.replace("$", "")) *
                          0.12 +
                        parseInt(activeAccountSize.price.replace("$", ""))
                      ).toFixed(0)}
                      .00
                    </p>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#3E4347]">
                      {/* Discounted Price */} Total Price
                    </h2>
                    <p className="text-lg font-semibold text-[#3E4347]">
                      {activeAccountSize.price}.00
                    </p>
                  </div>
                  {/* <div className=" w-full p-5 bg-[#428BC1]  rounded-3xl">
                    <p className="text-white  text-lg text-center border-b pb-1.5 mb-3 w-full font-semibold">
                      Coupon Code
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        className="w-full bg-transparent  placeholder:text-white text-white focus:outline-none text-sm"
                        value={coupen}
                        onChange={(e) => setCoupen(e.target.value)}
                      />
                      <button
                        disabled={!coupen || coupenApplied}
                        onClick={applyCoupon}
                        className="
                        disabled:opacity-50
                      bg-white px-4 py-1 text-sm rounded-xl
                      "
                      >
                        Apply
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={openForm}
                  className="  bg-vintage-50 text-center  rounded-full w-full hover:bg-slate-700 mt-4 text-white font-semibold py-4 px-10 2xl:text-base   focus:outline-none focus:shadow-outline"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </section>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AccountCheckout;
