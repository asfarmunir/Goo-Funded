"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

// Import the countries list
import { countries } from "countries-list";
import { ColorRing } from "react-loader-spinner";

// const formSchema = z.object({
//   firstName: z.string().min(2, {
//     message: "Please enter a valid first name",
//   }),
//   lastName: z.string().min(2, {
//     message: " Please enter a valid last name",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address",
//   }),
//   password: z.string().min(6, {
//     message: "Password should be atleast 6 characters",
//   }),
//   confirmPassword: z.string().min(6, {
//     message: "Password should be atleast 6 characters",
//   }),
//   country: z.string().min(2, {
//     message: "Please enter a your country",
//   }),
// });

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Please enter a valid first name",
    }),
    lastName: z.string().min(2, {
      message: "Please enter a valid last name",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password should be at least 6 characters",
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one capital letter",
      })
      .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(6, {
      message: "Password should be at least 6 characters",
    }),
    country: z.string().min(2, {
      message: "Please enter your country",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This ensures the error is attached to confirmPassword
  });

interface props {
  searchParams: {
    referrerCode?: string;
  };
}
const Page = ({ searchParams: { referrerCode } }: props) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      country: "",
    },
  });

  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      let res;

      if (referrerCode) {
        res = await axios.post(
          `/api/register?referral=${referrerCode}`,
          values
        );
      } else {
        res = await axios.post("/api/register", values);
      }

      if (!res) {
        throw new Error("Sign up failed");
      }

      await axios.post("/api/newsletter", { email: values.email });
      router.push("/api/auth/signin");
      toast.success("Account created successfully.");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast("Server error, please try again later");
      }
    }

    setIsLoading(false);
  }

  return (
    <div className=" w-full flex items-start justify-center bg-vintage-50 gap-2 h-screen overflow-hidden ">
      <div className=" w-full relative bg-[#F8F8F8] h-full   flex flex-col items-center justify-center rounded-xl p-4 md:p-8 md:py-8  2xl:p-10 ">
        <Image
          src="/gofunded/logo.png"
          alt="logo"
          width={130}
          height={130}
          className="absolute top-3 left-4 md:top-8 md:left-8"
        />
        <div className=" w-fit bg-white px-6 py-12 md:p-12 rounded-3xl shadow-sm max-h-[90svh] overflow-y-auto [scrollbar-width:none] scroll-smooth  ">
          <h2 className=" text-2xl md:text-3xl font-bold text-vintage-50 mb-2">
            Create your account
          </h2>

          <p className=" max-w-md  text-[#3E4347] text-[0.8rem] 2xl:text-[0.9rem] leading-loose font-light">
            Welcome! Please enter your information below to create an account
            and get started.
          </p>

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
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="mb-4 w-full">
                        <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                          First name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                            className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
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
                        <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                            className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight ">
                            <SelectValue placeholder="Select your country " />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(countries).map(
                              ([code, { name }]) => (
                                <SelectItem
                                  key={code}
                                  value={name}
                                  className=" bg-white text-black border-none"
                                >
                                  {name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-6 w-full">
                      <FormLabel className="block text-[0.7rem] 2xl:text-[0.75rem] ml-6 text-[#3E4347] -mb-[1.1rem]  w-fit  ">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Re-enter your password"
                          {...field}
                          type="password"
                          className="  border border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center mb-6 px-2">
                  <Checkbox.Root
                    className=" border-2 border-vintage-50 w-6 h-6 rounded-full"
                    id="terms"
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setIsChecked(checked === true)
                    }
                  >
                    <Checkbox.Indicator className="flex w-5 h-5 items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-vintage-50" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor="terms"
                    className="ml-2 text-xs 2xl:text-sm text-[#3E4347]font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    By continuing, you agree to our{" "}
                    <span className="text-vintage-50 font-bold">Terms</span> and{" "}
                    <span className="text-vintage-50 font-bold">
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>
                <div className="flex flex-col w-full mt-2 items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-vintage-50 mb-4  border  w-full rounded-full  text-white font-semibold py-6 md:py-8 px-10 2xl:text-lg   focus:outline-none focus:shadow-outline"
                    disabled={!isChecked}
                  >
                    {isLoading ? (
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
                      <span className=" capitalize">Create Account</span>
                    )}
                  </Button>
                  <label
                    htmlFor="terms"
                    className="text-xs 2xl:text-sm  text-[#3E4347]font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Have an account?{" "}
                    <Link
                      href={"/login"}
                      className="text-vintage-50 pl-1 font-bold"
                    >
                      Log In
                    </Link>
                  </label>
                </div>
              </form>
            </div>
          </Form>
        </div>
      </div>
      <div className="hidden md:flex h-full  relative rounded-xl overflow-hidden  flex-col items-center justify-center object-cover object-center   w-full  ">
        <Image
          src="/gofunded/authBg.webp"
          alt="signup"
          className=" w-full h-full object-cover object-bottom"
          width={400}
          height={400}
        />
        <div className=" absolute bottom-14">
          <Carousel orientation="horizontal">
            <CarouselContent className=" w-[320px] 2xl:w-[400px]  ">
              <CarouselItem>
                <Image
                  src="/vintage/images/feature1.svg"
                  alt="feature"
                  width={100}
                  className=" w-full"
                  height={100}
                />
              </CarouselItem>
              <CarouselItem>
                {" "}
                <Image
                  src="/vintage/images/feature2.svg"
                  alt="feature"
                  width={100}
                  className=" w-full"
                  height={100}
                />
              </CarouselItem>
              <CarouselItem>
                {" "}
                <Image
                  src="/vintage/images/feature3.svg"
                  alt="feature"
                  width={100}
                  className=" w-full"
                  height={100}
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className=" " />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Page;
