"use client";
// import { useCreateAccount } from "@/app/hooks/useCreateAccount";
// import { useCreateConfirmoInvoice } from "@/app/hooks/useCreateConfirmoInvoice";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "countries-list";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdOutlineClose } from "react-icons/md";
import { Checkbox } from "@radix-ui/react-checkbox";
import Link from "next/link";

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
  // phoneNumber: z.string().min(8, {
  //   message: "phone Number is required",
  // }),
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
  // }),
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
  // url search params
  const searchParams = useSearchParams();
  const accountType = searchParams.get("type");
  const accountSize = searchParams.get("accountSize");
  const accountPrice = searchParams.get("price");

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

  // user details
  const { status, data: session } = useSession();

  // form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      // phoneNumber: "",
      state: "",
      city: "",
      address: "",
      postalCode: "",
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

  const [step, setStep] = useState<number>(1);
  const [actionType, setActionType] = useState("");
  const [billingDetailsData, setBillingDetailsData] = useState({});
  const [coinbaseInvoiceCreated, setCoinbaseInvoiceCreated] = useState(false);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const localStep = localStorage.getItem("step");
    setStep(localStep ? parseInt(localStep) : 1);
  }, []);

  useEffect(() => {
    const localStep = localStorage.getItem("step");
    if (step === 1 && localStep !== "2") return;
    localStorage.setItem("step", step.toString());
  }, [step]);

  // billing address form submit
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
        console.log("🚀 ~ onSubmit ~ res:", res);
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

  // go back
  const goBack = () => {
    localStorage.removeItem("billing");
    localStorage.removeItem("step");
    setStep(1);
    router.push("/create-account");
  };

  // card form submit

  async function onSubmitCardPayment(values: any) {
    // create account
    const billing = JSON.parse(localStorage.getItem("billing") || "{}");
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
      billingDetailsData,
      paymentCardNumber: values?.paymentCardNumber,
      cardCode: values?.cardSecurityCode,
      expirationDate: values?.expirationDate,
      email: session?.user?.email,
      userId: session?.user ? session?.user.id ?? "" : "",
    };

    // submit to api
    createCreditInvoice(data);
  }

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className=" rounded-2xl overflow-hidden  md:min-w-[1100px] [scrollbar-width:none] 2xl:min-w-[1400px] h-[95svh] overflow-y-auto p-0">
        <div className=" w-full h-fit bg-[#F2F2F2]  p-4 2xl:p-6 relative">
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
          <section className=" w-full flex h-full   px-4 md:px-6 gap-8 pt-2 flex-col-reverse md:flex-row justify-center   ">
            <div className="flex flex-col gap-4 px-3  w-full md:max-w-[60%]">
              {!coinbaseInvoiceCreated && (
                <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                  <div>
                    <h2 className=" text-xl md:text-2xl mb-2.5 font-bold text-vintage-50 ">
                      Billing Details
                    </h2>
                    <p className=" text-[#848BAC] -mt-2  ">
                      Get funded and earn up to 70% of your trading profits.{" "}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-fit ">
                    <div className=" w-full md:w-52 bg-slate-100 rounded-full h-3">
                      <div
                        className={` ${
                          step === 1 ? "w-1/2" : "w-full"
                        } bg-vintage-50 h-full transition-all rounded-full`}
                      ></div>
                    </div>
                    <p className=" font-semibold">{step}/2</p>
                  </div>
                </div>
              )}

              {!coinbaseInvoiceCreated && step === 1 ? (
                <Form {...form}>
                  <div
                    id="first"
                    className="flex flex-col  items-center justify-center w-full gap-6 md:gap-4  my-6"
                  >
                    <form
                      id="container"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className=" w-full "
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
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
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
                                  placeholder=" enter your last name"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        <FormItem className="mb-4 w-full">
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
                        </FormItem>
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
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Select required onValueChange={field.onChange}>
                                  <SelectTrigger className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight ">
                                    <SelectValue placeholder=" select your country " />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(countries)
                                      .sort((a, b) =>
                                        a[1].name.localeCompare(b[1].name)
                                      )
                                      .map(([code, { name }]) => (
                                        <SelectItem key={code} value={name}>
                                          {name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
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
                        />
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
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
                      />
                      <p className="text-xs  2xl:text-sm text-[#848BAC]  pl- font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        By providing your information, you allow Vantage Pikcs
                        to charge your card for future payments in accordance
                        with their terms.
                      </p>

                      <div className="flex w-full border-t flex-wrap sm:flex-nowrap mb-4  mt-6 gap-2 items-center justify-center">
                        <button
                          className="bg-[#001E451A]    border border-slate-100 rounded-full text-vintage-50 font-semibold py-3  px-12 w-full 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                          onClick={goBack}
                        >
                          Back
                        </button>
                        <Button
                          type="submit"
                          onClick={() => setActionType("next")}
                          className="bg-vintage-50   rounded-full  text-white font-semibold py-6 px-12 w-full 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                        >
                          <span className=" capitalize">Next</span>
                        </Button>
                        <Button
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
                        </Button>
                      </div>
                    </form>
                  </div>
                </Form>
              ) : !coinbaseInvoiceCreated && step === 2 ? (
                <Form {...paymentCardForm}>
                  <div
                    id="first"
                    className="flex flex-col  items-center justify-center w-full gap-6 md:gap-4  my-6"
                  >
                    <form
                      id="container"
                      onSubmit={paymentCardForm.handleSubmit(
                        onSubmitCardPayment
                      )}
                      className=" w-full "
                      autoComplete="false"
                    >
                      <FormField
                        control={paymentCardForm.control}
                        name="paymentCardNumber"
                        render={({ field }) => (
                          <FormItem className="mb-4 w-full">
                            <FormControl>
                              <Input
                                required
                                placeholder="  enter card number"
                                {...field}
                                className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                        <FormField
                          control={paymentCardForm.control}
                          name="cardSecurityCode"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  autoComplete="new-password"
                                  maxLength={3}
                                  placeholder=" enter card cvv"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentCardForm.control}
                          name="expirationDate"
                          render={({ field }) => (
                            <FormItem className="mb-4 w-full">
                              <FormControl>
                                <Input
                                  required
                                  autoComplete="off"
                                  placeholder=" enter card expiry date"
                                  {...field}
                                  className="  focus:outline-none  focus:border mr-0 md:mr-6  rounded-lg bg-[#F2F2F2] w-full p-4  2xl:py-6 2xl:px-6 text-vintage-50 leading-tight "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <p className="text-xs  2xl:text-sm text-[#848BAC]  font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        By providing your card information, you allow Vintage
                        Picks to charge your card for future payments in
                        accordance with their terms.
                      </p>

                      <div className="flex w-full mt-4 mb-6 gap-2 items-center justify-center">
                        <button
                          className="bg-[#001E451A]    border border-slate-100 rounded-full  mt-4 text-vintage-50 font-semibold py-3  px-12 w-full 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </button>
                        <Button
                          disabled={isPending}
                          type="submit"
                          className="bg-vintage-50   w-full rounded-full mt-4 text-white font-semibold py-6 px-10 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                        >
                          {isPending ? (
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
                            <span className=" capitalize">Let's Go</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Form>
              ) : null}

              {coinbaseInvoiceCreated && (
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                  <Image
                    src="/vintage/images/check.svg"
                    alt="check"
                    width={100}
                    height={100}
                  />

                  <h2 className="text-xl md:text-2xl mb-2.5 font-bold text-vintage-50 ">
                    Payment Invoice Created
                  </h2>
                  <p className="text-[#848BAC] -mt-2  ">
                    Please complete the payment on the opened tab
                  </p>
                  <Link
                    href="/"
                    className="bg-vintage-50 mb-4   rounded-full mt-4 text-white font-semibold py-3.5 text-center px-12 w-full 2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                  >
                    <span className=" capitalize">Dashboard</span>
                  </Link>
                </div>
              )}
            </div>
            {!coinbaseInvoiceCreated && (
              <div className="flex flex-col h-full   gap-3   w-full md:max-w-[40%]">
                <div className=" bg-[#F8F8F8] p-5 h-[90%] 2xl:p-6 rounded-2xl border border-[#001E451A]">
                  <div className="flex items-center border-b pb-6 border-slate-300 justify-between">
                    <div>
                      <h2 className=" text-lg md:text-xl font-bold ">
                        Refundable Fee
                      </h2>
                      <p className="text-sm text-gray-700">
                        for ${accountSize} account
                      </p>
                    </div>
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
                      100% Refundable
                    </h2>
                  </div>
                  <div className=" flex flex-col gap-3  py-6  ">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">original Price</h2>
                      <p className=" font-semibold">
                        {" "}
                        $
                        {(
                          parseInt(accountPrice!.replace("$", "")) * 0.12 +
                          parseInt(accountPrice!.replace("$", ""))
                        ).toFixed(0)}
                        .00
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        Discounted Price
                      </h2>
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
