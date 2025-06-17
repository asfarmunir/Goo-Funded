"use client";
import { useCreateCoinbaseInvoice } from "@/app/hooks/useCreateCoinbaseInvoice";
import { useCreditCardInvoice } from "@/app/hooks/useCreditCardInvoice";
import { useCreateNowpaymentInvoice } from "@/app/hooks/useCreateNowpaymentInvoice";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "countries-list";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import clsx from "clsx";

const bankDetails = [
  {
    bankImage: "/banks/bank3.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "CIH",
    accountNumber: "230690576631522503560129",
    fullName: "amine bozid",
  },
  {
    bankImage: "/banks/bank4.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Attijariwafa Bank",
    accountNumber: "007690000476530040101458",
    fullName: "samir alim",
  },
  {
    bankImage: "/banks/bank1.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Lbankalik",
    accountNumber: "007690000476530040101458",
    fullName: "samir alim",
  },
  {
    bankImage: "/banks/bank2.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Banque Populaire",
  },
  {
    bankImage: "/banks/bank5.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Bank of Africa",
    accountNumber: "011500000011200000289902",
    fullName: "service",
  },
  {
    bankImage: "/banks/bank6.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Al Barid Bank",
  },
  {
    bankImage: "/banks/bank7.jpeg",
    link: "https://t.me/goofundedrecharge",
    name: "Societe Generale",
  },
];

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name should be atleast 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name should be atleast 2 characters",
  }),
  country: z.string().min(2, {
    message: "Please enter a your country name",
  }),
  state: z.string().min(2, {
    message: "Please enter a valid state name",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city name",
  }),
  address: z.string().min(4, {
    message: "Please enter a valid address",
  }),
  postalCode: z.string().min(4, {
    message: "Please enter a valid postal code",
  }),
});

const paymentCardSchema = z.object({
  paymentCardNumber: z.string().min(16, {
    message: "Please enter a valid card number",
  }),
  expirationDate: z.string().min(4, {
    message: "Please enter a valid card expiry",
  }),
  cardSecurityCode: z.string().min(3, {
    message: "Please enter a valid card cvv",
  }),
});

const p2pPaymentSchema = z.object({
  transactionId: z.string().min(5, {
    message: "Transaction ID is required",
  }),
  paymentProof: z.array(z.string()).min(1, {
    message: "Payment proof is required",
  }),
});

interface CheckoutPaymentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountType = searchParams.get("type");
  const accountSize = searchParams.get("accountSize");
  const accountPrice = searchParams.get("price");

  const [sheetSide, setSheetSide] = useState<"bottom" | "right">("bottom"); // State for sheet side

  // Detect screen size and set sheet side
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSheetSide("right");
      } else {
        setSheetSide("bottom");
      }
    };

    // Set initial side
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { mutateAsync: createPaymentInvoice, isPending: loadingInvoice } =
    useCreateNowpaymentInvoice();

  const handleSuccess = (data: any) => {
    localStorage.removeItem("billing");
    localStorage.removeItem("step");
    toast.success("Account created successfully!");
    router.push("/dashboard");
  };

  const handleError = (error: Error) => {
    console.error(error);
    toast.error(error.message || "Failed to create account");
  };

  const { mutate: createCreditInvoice, isPending } = useCreditCardInvoice({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const { status, data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "not_required",
      lastName: "not_required",
      country: "not_required",
      state: "not_required",
      city: "not_required",
      address: "not_required",
      postalCode: "not_required",
    },
  });

  const paymentCardForm = useForm({
    resolver: zodResolver(paymentCardSchema),
    defaultValues: {
      paymentCardNumber: "",
      expirationDate: "",
      cardSecurityCode: "",
    },
  });

  const [step, setStep] = useState<number>(2);
  const [actionType, setActionType] = useState("");
  const [billingDetailsData, setBillingDetailsData] = useState({
    firstName: "not_required",
    lastName: "not_required",
    country: "not_required",
    state: "not_required",
    city: "not_required",
    address: "not_required",
    postalCode: "not_required",
  });
  const [coinbaseInvoiceCreated, setCoinbaseInvoiceCreated] = useState(false);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const localStep = localStorage.getItem("step");
    setStep(2);
  }, []);

  async function onSubmit(values: any) {
    const data = {
      account: {
        accountSize: accountSize,
        accountType:
          accountType === "2"
            ? "TWO_STEP"
            : accountType === "3"
              ? "THREE_STEP"
              : "",
        status: "CHALLENGE",
        accountPrice: accountPrice,
      },
      billingDetails: { ...values, email: session?.user?.email, phone: "" },
      customerEmail: session?.user?.email,
      invoice: {
        amount: accountPrice,
        currencyFrom: "USD",
      },
    };

    if (actionType === "crypto") {
      const newTab = window.open("about:blank", "_blank");

      if (!newTab) {
        console.warn("Popup was blocked. Please allow popups for this site.");
        return;
      }
      try {
        toast.loading("Creating payment invoice...");
        const res = await createPaymentInvoice(data);
        if (res?.invoice_url) {
          newTab.location.href = res.invoice_url;
          toast.dismiss();
          toast.success("Invoice created successfully");
          setCoinbaseInvoiceCreated(true);
        } else {
          console.error("No hosted_url found in the response");
          newTab.close();
        }
      } catch (error) {
        toast.dismiss();
        console.error("Failed to create invoice:", error);
        toast.error("Failed to create invoice");
        newTab.close();
      }
    } else if (actionType === "next") {
      setBillingDetailsData({
        ...values,
        email: session?.user?.email,
        phone: "",
      });
      setStep(2);
    }
  }

  const goBack = () => {
    localStorage.removeItem("billing");
    localStorage.removeItem("step");
    setStep(1);
    router.push("/create-account");
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  const [uploading, setUploading] = useState(false);

  const p2pPaymentForm = useForm({
    resolver: zodResolver(p2pPaymentSchema),
    defaultValues: {
      transactionId: "",
      paymentProof: [],
    },
  });

  async function onSubmitP2PPayment(e: any) {
    e.preventDefault();
    //data object to send to the p2p API
    // const data = {
    //   account: {
    //     accountSize: accountSize,
    //     accountType:
    //       accountType === "2"
    //         ? "TWO_STEP"
    //         : accountType === "3"
    //           ? "THREE_STEP"
    //           : "",
    //     status: "CHALLENGE",
    //     accountPrice: accountPrice,
    //   },
    //   billingDetailsData: billingDetailsData,
    //   paymentMethod: "p2p",
    //   transactionId: values.transactionId,
    //   paymentProof: values.paymentProof,
    //   email: session?.user?.email,
    //   userId: session?.user ? (session?.user.id ?? "") : "",
    // };

    const data = {
      account: {
        accountSize: accountSize,
        accountType:
          accountType === "2"
            ? "TWO_STEP"
            : accountType === "3"
              ? "THREE_STEP"
              : "",
        status: "CHALLENGE",
        accountPrice: accountPrice,
      },
      billingDetails: billingDetailsData,
      customerEmail: session?.user?.email,
      invoice: {
        amount: accountPrice,
        currencyFrom: "USD",
      },
    };
    console.log("🚀 ~ onSubmitP2PPayment ~ data:", data);

    const newTab = window.open("about:blank", "_blank");

    if (!newTab) {
      console.warn("Popup was blocked. Please allow popups for this site.");
      return;
    }
    try {
      toast.loading("Creating payment invoice...");
      const res = await createPaymentInvoice(data);
      if (res?.invoice_url) {
        newTab.location.href = res.invoice_url;
        toast.dismiss();
        toast.success("Invoice created successfully");
        setCoinbaseInvoiceCreated(true);
      } else {
        console.error("No hosted_url found in the response");
        newTab.close();
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to create invoice:", error);
      toast.error("Failed to create invoice");
      newTab.close();
    }
    // I used the previous credit card setup here, i requests call to the /person-to-person route.
    // createCreditInvoice(data);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="rounded-2xl overflow-hidden md:min-w-[1100px] [scrollbar-width:none] 2xl:min-w-[1400px] h-[95svh] overflow-y-auto p-0">
        <div className="w-full h-fit bg-[#F2F2F2] p-4 2xl:p-6 relative">
          <h2 className="text-vintage-50 text-xl font-bold 2xl:text-2xl">
            Create Account
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-black"
          >
            <MdOutlineClose className="text-2xl" />
          </button>
        </div>

        {status === "authenticated" && (
          <section className="w-full flex h-full px-4 md:px-6 gap-8 pt-2 flex-col md:flex-row justify-center">
            <div className="flex flex-col gap-4 px-3 w-full md:max-w-[60%]">
              {!coinbaseInvoiceCreated && (
                <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                  <div>
                    <h2 className="text-xl md:text-2xl mb-2.5 font-bold text-vintage-50">
                      Billing Details
                    </h2>
                    <p className="text-[#848BAC] -mt-2">
                      Get funded and earn up to 70% of your sports profits.
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2 w-full md:w-fit">
                    <div className="w-full md:w-52 bg-slate-100 rounded-full h-3">
                      <div
                        className={`${
                          step === 1 ? "w-1/2" : "w-full"
                        } bg-vintage-50 h-full transition-all rounded-full`}
                      ></div>
                    </div>
                    <p className="font-semibold">{step}/2</p>
                  </div> */}
                </div>
              )}

              {!coinbaseInvoiceCreated && step === 1 ? (
                <Form {...form}>
                  <div
                    id="first"
                    className="flex flex-col items-center justify-center w-full gap-6 md:gap-4 my-6"
                  >
                    <form
                      id="container"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder="enter your first name"
                                  {...field}
                                  className="focus:outline-none focus:border mr-0 md:mr-6 rounded-lg bg-[#F2F2F2] w-full p-4 2xl:py-6 2xl:px-6 text-vintage-50 leading-tight"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder="enter your last name"
                                  {...field}
                                  className="focus:outline-none focus:border mr-0 md:mr-6 rounded-lg bg-[#F2F2F2] w-full p-4 2xl:py-6 2xl:px-6 text-vintage-50 leading-tight"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        {/* <FormItem className="mb-4 w-full">
                          <FormControl>
                            <Input
                              required
                              readOnly
                              placeholder="enter your email"
                              defaultValue={session?.user?.email}
                              className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem> */}
                        {/* <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder=" enter your phone number"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        <FormItem className="mb-4 w-full">
                          <FormControl>
                            <Input
                              required
                              readOnly
                              placeholder="enter your email"
                              defaultValue={session?.user?.email}
                              className="focus:outline-none focus:border mr-0 md:mr-6 rounded-lg bg-[#F2F2F2] w-full p-4 2xl:py-6 2xl:px-6 text-vintage-50 leading-tight"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <select
                                  required
                                  onChange={field.onChange}
                                  value={field.value}
                                  className="focus:outline-none focus:border max-h-[200px] mr-0 md:mr-6 rounded-lg bg-[#F2F2F2] w-full p-3 2xl:px-6 text-vintage-50 leading-tight"
                                >
                                  <option value="">Select your country</option>
                                  {Object.entries(countries)
                                    .sort((a, b) =>
                                      a[1].name.localeCompare(b[1].name)
                                    )
                                    .map(([code, { name }]) => (
                                      <option key={code} value={name}>
                                        {name}
                                      </option>
                                    ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder=" enter your state"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                      </div>
                      {/* <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder="enter your city"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  placeholder=" enter postal code"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="mb-4 w-full">
                            <FormControl>
                              <Input
                                required
                                placeholder=" enter your address"
                                {...field}
                                className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                      <p className="text-xs 2xl:text-sm text-[#848BAC] pl- font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        By providing your information, you allow Goo Funded to
                        charge your card for future payments in accordance with
                        their terms.
                      </p>

                      <div className="flex w-full border-t flex-wrap sm:flex-nowrap mb-4 mt-6 gap-2 items-center justify-center">
                        <button
                          className="bg-[#001E451A] border border-slate-100 rounded-full text-vintage-50 font-semibold py-3 px-12 w-full 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                          onClick={goBack}
                        >
                          Back
                        </button>
                        <Button
                          type="submit"
                          onClick={() => setActionType("next")}
                          className="bg-vintage-50 rounded-full text-white font-semibold py-6 px-12 w-full 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                        >
                          <span className="capitalize">Next</span>
                        </Button>
                        {/* <Button
                          type="submit"
                          onClick={() => setActionType("crypto")}
                          className="bg-vintage-50    rounded-full  text-white font-semibold py-6 px-12 w-full 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                          disabled={loadingInvoice}
                        >
                          {loadingInvoice ? (
                            <ColorRing
                              visible={true}
                              height="35"
                              width="35"
                              ariaLabel="color-ring-loading"
                              wrapperStyle={{}}
                              wrapperClass="color-ring-wrapper"
                              colors={[
                                "#ffffff",
                                "#ffffff",
                                "#ffffff",
                                "#ffffff",
                                "#ffffff",
                              ]}
                            />
                          ) : (
                            <span className=" capitalize">Pay With Crypto</span>
                          )}
                        </Button> */}
                      </div>
                    </form>
                  </div>
                </Form>
              ) : !coinbaseInvoiceCreated && step === 2 ? (
                // <Form {...p2pPaymentForm}>
                //   <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-4 my-6">
                //     <form
                //       onSubmit={p2pPaymentForm.handleSubmit(onSubmitP2PPayment)}
                //       className="w-full"
                //     >
                //       <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                //         <h3 className="font-bold text-xl ">
                //           Bank Transfer Details
                //         </h3>
                //         <h4 className="text-lg font-semibold border-b w-full  pb-3 text-slate-500 mb-3">
                //           Please transfer the amount to the following bank
                //           account and wait for confirmation.
                //         </h4>
                //         <p className="mb-2">
                //           <strong>Bank Name:</strong> Your Bank Name
                //         </p>
                //         <p className="mb-2">
                //           <strong>Account Name:</strong> Your Account Name
                //         </p>
                //         <p className="mb-2">
                //           <strong>Account Number:</strong> 1234567890
                //         </p>
                //         <p className="mb-2">
                //           <strong>SWIFT/BIC:</strong> YOURSWIFTCODE
                //         </p>
                //         <p className="mb-2">
                //           <strong>Reference:</strong> Use your email as
                //           reference
                //         </p>
                //       </div>

                //       <FormField
                //         control={p2pPaymentForm.control}
                //         name="transactionId"
                //         render={({ field }) => (
                //           <FormItem className="mb-4 w-full">
                //             <FormLabel>Transaction ID/Reference</FormLabel>
                //             <FormControl>
                //               <Input
                //                 required
                //                 placeholder="Enter your bank transaction ID"
                //                 {...field}
                //                 className="focus:outline-none focus:border mr-0 md:mr-6 rounded-lg bg-[#F2F2F2] w-full p-4 2xl:py-6 2xl:px-6 text-vintage-50 leading-tight"
                //               />
                //             </FormControl>
                //             <FormMessage />
                //           </FormItem>
                //         )}
                //       />

                //       <FormField
                //         control={p2pPaymentForm.control}
                //         name="paymentProof"
                //         render={({ field }) => (
                //           <FormItem className="mb-4 w-full">
                //             <FormLabel>
                //               Payment Proof (Screenshot/Receipt)
                //             </FormLabel>
                //             <FormControl>
                //               <div>
                //                 <input
                //                   type="file"
                //                   accept="image/*"
                //                   multiple
                //                   onChange={handleFileUpload}
                //                   className="hidden"
                //                   id="payment-proof-upload"
                //                 />
                //                 <label
                //                   htmlFor="payment-proof-upload"
                //                   className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition"
                //                 >
                //                   {uploading ? (
                //                     <div className="flex items-center gap-2">
                //                       <ColorRing
                //                         visible={true}
                //                         height="24"
                //                         width="24"
                //                         ariaLabel="color-ring-loading"
                //                         wrapperStyle={{}}
                //                         wrapperClass="color-ring-wrapper"
                //                         colors={[
                //                           "#000",
                //                           "#000",
                //                           "#000",
                //                           "#000",
                //                           "#000",
                //                         ]}
                //                       />
                //                       <span>Uploading...</span>
                //                     </div>
                //                   ) : (
                //                     <>
                //                       <FiUploadCloud
                //                         size={40}
                //                         className=" mb-3 text-gray-500"
                //                       />

                //                       <p className="text-sm text-gray-500">
                //                         Click to upload or drag and drop
                //                       </p>
                //                       <p className="text-xs text-gray-400">
                //                         PNG, JPG up to 5MB
                //                       </p>
                //                     </>
                //                   )}
                //                 </label>
                //                 {p2pPaymentForm.watch("paymentProof")?.length >
                //                   0 && (
                //                   <div className="mt-4 grid grid-cols-2 gap-2">
                //                     {p2pPaymentForm
                //                       .watch("paymentProof")
                //                       .map((url, index) => (
                //                         <div
                //                           key={index}
                //                           className="relative bg-slate-50 flex items-center justify-center "
                //                         >
                //                           <Image
                //                             src={url}
                //                             width={150}
                //                             height={150}
                //                             alt={`Payment proof ${index + 1}`}
                //                             className="rounded-md object-cover"
                //                           />
                //                           <button
                //                             type="button"
                //                             onClick={() => {
                //                               const updatedProofs = [
                //                                 ...p2pPaymentForm.watch(
                //                                   "paymentProof"
                //                                 ),
                //                               ];
                //                               updatedProofs.splice(index, 1);
                //                               p2pPaymentForm.setValue(
                //                                 "paymentProof",
                //                                 updatedProofs
                //                               );
                //                             }}
                //                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                //                           >
                //                             <MdOutlineClose size={14} />
                //                           </button>
                //                         </div>
                //                       ))}
                //                   </div>
                //                 )}
                //               </div>
                //             </FormControl>
                //             <FormMessage />
                //           </FormItem>
                //         )}
                //       />

                //       <div className="flex w-full mt-4 mb-6 gap-2 items-center justify-center">
                //         <button
                //           className="bg-[#001E451A] border border-slate-100 rounded-full mt-4 text-vintage-50 font-semibold py-3 px-12 w-full 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                //           onClick={() => setStep(1)}
                //         >
                //           Back
                //         </button>
                //         <Button
                //           disabled={isPending || uploading}
                //           type="submit"
                //           className="bg-vintage-50 w-full rounded-full mt-4 text-white font-semibold py-6 px-10 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                //         >
                //           {isPending ? (
                //             <ColorRing
                //               visible={true}
                //               height="35"
                //               width="35"
                //               ariaLabel="color-ring-loading"
                //               wrapperStyle={{}}
                //               wrapperClass="color-ring-wrapper"
                //               colors={[
                //                 "#ffffff",
                //                 "#ffffff",
                //                 "#ffffff",
                //                 "#ffffff",
                //                 "#ffffff",
                //               ]}
                //             />
                //           ) : (
                //             <span className="capitalize">Submit Payment</span>
                //           )}
                //         </Button>
                //       </div>
                //     </form>
                //   </div>
                // </Form>
                <div className="flex flex-col items-center justify-center w-full gap-6 md:gap-4 my-6">
                  <form onSubmit={onSubmitP2PPayment} className="w-full">
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold">
                        1. Pay with crypto
                      </h2>
                      <p className="text-sm 2xl:text-base text-gray-500">
                        You will be redirected to the crypto payment gateway to
                        complete your payment. Please ensure you have the
                        necessary funds in your wallet.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="bg-vintage-50 mb-12 rounded-full text-white font-semibold py-6 px-12 w-full 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                      disabled={loadingInvoice}
                    >
                      {loadingInvoice ? (
                        <ColorRing
                          visible={true}
                          height="35"
                          width="35"
                          ariaLabel="color-ring-loading"
                          wrapperStyle={{}}
                          wrapperClass="color-ring-wrapper"
                          colors={[
                            "#ffffff",
                            "#ffffff",
                            "#ffffff",
                            "#ffffff",
                            "#ffffff",
                          ]}
                        />
                      ) : (
                        <span className="capitalize">Start Transaction</span>
                      )}
                    </Button>
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold">
                        2. Bank Transfer Options
                      </h2>
                      <p className="text-sm 2xl:text-base text-gray-500">
                        Select the prefered bank to complete your payment.
                      </p>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bankDetails.map((detail, index) => (
                        <Sheet key={index}>
                          <SheetTrigger>
                            <div className="h-full bg-[#F8F8F8] shadow-md rounded-lg overflow-hidden hover:shadow-2xl transition-shadow">
                              <div className="relative aspect-video w-full">
                                <Image
                                  src={detail.bankImage}
                                  alt={detail.name}
                                  fill
                                  className="object-contain p-4"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                              <div className="p-4 bg-vintage-50 flex items-center justify-center">
                                <h3 className="text-lg font-bold text-white">
                                  {detail.name}
                                </h3>
                              </div>
                            </div>
                          </SheetTrigger>
                          {/* <SheetContent
                            side="bottom"
                            className="bg-[#F8F8F8] p-6 rounded-t-2xl"
                          > */}
                          <SheetContent
                            side={sheetSide}
                            className={clsx(
                              "bg-[#F8F8F8] p-6 md:min-w-[500px]",
                              sheetSide === "bottom" && "rounded-t-2xl",
                              sheetSide === "right" && "rounded-l-2xl"
                            )}
                          >
                            <SheetHeader>
                              <SheetTitle
                                className="text-vintage-50 text-2xl font-bold text-right"
                                dir="rtl"
                              >
                                تفاصيل الدفع لـ: {detail.name}
                              </SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-6" dir="rtl">
                              <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-800 text-sm 2xl:text-base  font-bold text-right">
                                <div dir="rtl">
                                  <h3 className="text-lg 2xl:text-2xl text-vintage-50 font-bold mb-2">
                                    🔹 اختار رأس المال المناسب ليك وبدأ 👇
                                  </h3>
                                  <p className="text-sm 2xl:text-xl text-red-800 mb-2">
                                    (ستقوم بالاداء بدرهم للمقيمين بلمغرب)
                                  </p>
                                  <ul className="list-disc 2xl:text-lg list-inside space-y-1 mb-2">
                                    <li>💵 1000$ 💳 49$ = 490 درهم</li>
                                    <li>💵 2000$ 💳 76$ = 760 درهم</li>
                                    <li>💵 5000$ 💳 167$ = 1670 درهم</li>
                                    <li>💵 10000$ 💳 324$ = 3224 درهم</li>
                                  </ul>
                                  <p className="text-sm 2xl:text-xl font-bold">
                                    ✅ اختر الحساب المناسب لك ، و ارسل المبلغ
                                    فالحساب اسفله ، وسنقوم برد عليك فأقل من 3
                                    ساعات 🚨
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-4 py-6 shadow-inner">
                                <p className="text-lg 2xl:text-xl font-semibold text-vintage-50 text-right">
                                  اسم البنك: {detail.name}
                                </p>
                                {detail.accountNumber && (
                                  <p className="text-sm  2xl:text-base text-gray-700 text-right mt-2">
                                    <span className="font-bold">
                                      رقم الحساب البنكي:
                                    </span>
                                    {"   "}
                                    {detail.accountNumber}
                                  </p>
                                )}
                                {detail.fullName && (
                                  <p className="text-sm 2xl:text-base text-gray-700 text-right mt-2">
                                    <span className="font-bold">
                                      الاسم الكامل للمستلم:
                                    </span>
                                    {"   "}
                                    {detail.fullName}
                                  </p>
                                )}
                              </div>
                              <div className="text-center mt-6">
                                <p
                                  className="text-lg font-semibold text-vintage-50 mb-2"
                                  dir="rtl"
                                >
                                  ارسل صورة إيصال هنا
                                </p>
                                <a
                                  href={detail.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-vintage-50 text-white font-semibold py-3 px-8 rounded-full text-sm 2xl:text-base hover:bg-vintage-100 transition"
                                >
                                  إرسال عبر Telegram
                                </a>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      ))}
                    </div>
                  </form>
                </div>
              ) : null}

              {coinbaseInvoiceCreated && (
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                  <Image
                    src="/vintage/images/check.svg"
                    alt="check"
                    width={100}
                    height={100}
                  />
                  <h2 className="text-xl md:text-2xl mb-2.5 font-bold text-vintage-50">
                    Payment Invoice Created
                  </h2>
                  <p className="text-[#848BAC] -mt-2">
                    Please complete the payment on the opened tab
                  </p>
                  <Link
                    href="/"
                    className="bg-vintage-50 mb-4 rounded-full mt-4 text-white font-semibold py-3.5 text-center px-12 w-full 2xl:text-base text-sm focus:outline-none focus:shadow-outline"
                  >
                    <span className="capitalize">Dashboard</span>
                  </Link>
                </div>
              )}
            </div>
            {!coinbaseInvoiceCreated && (
              <div className="flex flex-col  h-fit gap-3 w-full md:max-w-[40%]">
                <div className="bg-[#F8F8F8] p-5 h-[90%] 2xl:p-6 rounded-2xl border border-[#001E451A]">
                  <div className="flex items-center border-b pb-6 border-slate-300 justify-between">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold">
                        Refundable Fee
                      </h2>
                      <p className="text-sm text-gray-700">
                        for ${accountSize} account
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-b py-6 border-slate-300">
                    <h2 className="inline-flex text-sm 2xl:text-base font-semibold items-center gap-2">
                      <Image
                        src="/vintage/images/check.svg"
                        alt="line"
                        width={25}
                        height={25}
                        className=""
                      />
                      One time fee
                    </h2>
                    <h2 className="inline-flex text-sm 2xl:text-base font-semibold items-center gap-2">
                      <Image
                        src="/vintage/images/check.svg"
                        alt="line"
                        width={25}
                        height={25}
                        className=""
                      />
                      100% Refundable
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3 py-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Total Price</h2>
                      <p className="text-lg font-semibold">
                        {accountPrice!}.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckoutPayment;
