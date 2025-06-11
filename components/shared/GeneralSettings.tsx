"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import { userStore } from "@/app/store/user";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name should be atleast 2 characters",
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: "Last name should be atleast 2 characters",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    })
    .optional(),

  phone: z.string().optional(),
  address: z.string().optional(),
  // dateOfBirth: z
  //   .string()
  //   .min(2, {
  //     message: "Please enter a valid date of birth",
  //   })
  //   .optional(),
});

const passFormSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password should be atleast 8 characters",
    })
    .optional(),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Please enter password again",
    })
    .optional(),
});

const GeneralSettings = ({
  modalRef,
  tab,
  user,
}: {
  modalRef: React.RefObject<HTMLButtonElement>;
  tab: string;
  user: any;
}) => {
  const updateUser = userStore((state) => state.setUser);
  const { data: session }: any = useSession();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: session?.user?.email || undefined,
      firstName: user?.firstName || undefined,
      lastName: user?.lastName || undefined,
      phone: user?.phoneNumber || undefined,
      address: user?.address || undefined,
      dateOfBirth: user?.dateOfBirth || undefined,
    },
  });

  const [existingPassword, setExistingPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  const passForm = useForm({
    resolver: zodResolver(passFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: any) {
    try {
      // const formattedDate = new Date(values.dateOfBirth)
      //   .toISOString()
      //   .split("T")[0];

      const userData = {
        id: session?.user?.id,
        firstName: values.firstName,
        lastName: values.lastName,
        // email: values.email,
        phone: values.phone,
        address: values.address,
        // dateOfBirth: formattedDate,
        password: values.password !== "password" ? values.password : undefined,
      };
      console.log("🚀 ~ onSubmit ~ userData:", userData);

      const response = await axios.patch(`/api/general-setting`, userData);

      console.log("🚀 ~ onSubmit ~ response:", response);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        updateUser(response.data.user);
      } else {
        console.error("Failed to update user", response);
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while updating your profile.");
    }
  }

  async function changePassword(values: any) {
    try {
      const response = await axios.patch(`/api/general-setting`, {
        id: session?.user?.id,
        ...values,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
      } else {
        console.error("Failed to update user", response);
        toast.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while updating your password.");
    }
  }

  async function confirmPassword(e: any) {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/auth/verify-password`, {
        password: existingPassword,
        email: session?.user?.email,
      });

      const data = await response.data;
      console.log("🚀 ~ confirmPassword ~ data:", data);

      if (data.valid) {
        setPasswordConfirmed(true);
      } else {
        console.error("Invalid Password", response);
        toast.error("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while updating your password.");
    }
  }

  return (
    <div className="flex flex-col  gap-4   w-full  ">
      <h2 className="text-lg 2xl:text-xl font-semibold text-vintage-50">
        Personal Information
      </h2>
      <p className="text-sm 2xl:text-base -mt-2 mb-1.5 text-gray-700">
        {!passwordConfirmed
          ? "Please enter your existing password"
          : "Update your personal information"}
      </p>
      {tab === "general" && (
        <Form {...form}>
          <div
            id="first"
            className="flex flex-col  items-center justify-center w-full gap-6 md:gap-4  "
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
                          placeholder="enter your first name"
                          {...field}
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
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
                          placeholder=" enter your last name"
                          {...field}
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormControl>
                      <Input
                        disabled
                        placeholder="enter your email"
                        {...field}
                        className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormControl>
                        <Input
                          placeholder=" enter your phone number"
                          {...field}
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
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
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormControl>
                        <Input
                          placeholder=" enter your address"
                          {...field}
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormControl>
                      <Input
                        placeholder="YYYY-MM-DD"
                        {...field}
                        className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              </div>
              <div className="flex items-center justify-end w-full gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    if (modalRef.current) modalRef.current.click();
                  }}
                  className="bg-[#001E451A]  rounded-full hover:bg-white  mt-4  font-semibold p-6 border text-vintage-50 px-9  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                >
                  <span className=" capitalize">Cancel</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-vintage-50  rounded-full  mt-4 text-white font-semibold p-6  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                >
                  <span className=" capitalize">Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </Form>
      )}
      {tab === "password" &&
        (!passwordConfirmed ? (
          <form className="  w-full gap-2 md:gap-4" onSubmit={confirmPassword}>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Enter your current password"
                value={existingPassword}
                onChange={(e) => setExistingPassword(e.target.value)}
                type="text"
                className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
              />
            </div>

            <div className="flex items-center mt-2 justify-end w-full gap-4">
              <Button
                type="button"
                onClick={() => {
                  if (modalRef.current) modalRef.current.click();
                }}
                className="bg-[#001E451A]  rounded-full hover:bg-white  mt-4  font-semibold p-6 border text-vintage-50 px-9  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
              >
                <span className=" capitalize">Cancel</span>
              </Button>
              <Button
                type="submit"
                disabled={!existingPassword}
                className="bg-vintage-50  rounded-full  mt-4 text-white font-semibold p-6 px-12  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
              >
                <span className=" capitalize">Submit</span>
              </Button>
            </div>
          </form>
        ) : (
          <Form {...passForm}>
            <form
              className="  w-full gap-2 md:gap-4"
              onSubmit={passForm.handleSubmit(changePassword)}
            >
              <div className="flex items-center gap-4">
                <FormField
                  control={passForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          type="text"
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-4 w-full">
                      <FormControl>
                        <Input
                          placeholder="Re-enter your password"
                          type="text"
                          {...field}
                          className="   focus:outline-none  border  focus:border mr-0 md:mr-6  rounded-xl bg-[#F8F8F8] w-full p-4  2xl:py-6 2xl:px-6  leading-tight "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end w-full gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    if (modalRef.current) modalRef.current.click();
                  }}
                  className="bg-[#001E451A]  rounded-full hover:bg-white  mt-4  font-semibold p-6 border text-vintage-50 px-9  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                >
                  <span className=" capitalize">Cancel</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-vintage-50  rounded-full  mt-4 text-white font-semibold p-6 px-12  2xl:text-base text-sm   focus:outline-none focus:shadow-outline"
                >
                  <span className=" capitalize">Reset</span>
                </Button>
              </div>
            </form>
          </Form>
        ))}
    </div>
  );
};

export default GeneralSettings;
