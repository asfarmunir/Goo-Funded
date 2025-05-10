"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorRing } from "react-loader-spinner";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

const Page = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email: values.email,
      });
      if (response.status === 200) {
        toast.success("A reset link has been sent to your email!");
      }
    } catch (error) {
      toast.error("Error: User not found or issue sending email.");
    }
    setLoading(false);
  }

  return (
    <div className=" w-full flex items-start justify-center bg-vintage-50 h-screen overflow-hidden ">
      <div className=" w-full relative bg-[#F8F8F8]  h-svh  flex flex-col items-center justify-center rounded-xl p-8 py-8  2xl:p-10 ">
        <Image
          src="/gofunded/logo.png"
          alt="logo"
          width={130}
          height={130}
          className="absolute top-3 left-4 md:top-8 md:left-8"
        />
        <div className=" w-fit bg-white p-12 rounded-3xl shadow-sm max-h-[90svh] overflow-y-auto [scrollbar-width:none] scroll-smooth  ">
          <h2 className=" text-2xl md:text-3xl font-bold text-vintage-50 mb-2">
            Reset your password
          </h2>
          <p className=" max-w-md  text-[#3E4347] text-[0.8rem] 2xl:text-[0.9rem] leading-loose font-light">
            Please enter your email to receive a password reset link.
          </p>

          <Form {...form}>
            <div
              id="email-verification"
              className="flex flex-col items-center justify-center w-full gap-6 md:gap-4 mt-6"
            >
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                          className="  border  border-[#001E451A] mr-0 md:mr-6   rounded-full  w-full p-4  py-6  2xl:py-7 2xl:px-6 text-[#3E4347] leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col w-full mt-6 items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-vintage-50 mb-4  border  w-full rounded-full  text-white font-semibold py-6 2xl:py-7 px-10 2xl:text-lg   focus:outline-none focus:shadow-outline"
                  >
                    {loading ? (
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
                      <span className="capitalize">Submit</span>
                    )}
                  </Button>
                  <label
                    htmlFor="terms"
                    className="text-xs 2xl:text-sm  text-[#3E4347] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      <div className="hidden md:flex h-svh relative  flex-col items-center justify-center object-cover object-center   w-full  ">
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
