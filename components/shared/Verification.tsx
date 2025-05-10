import { CheckIcon } from "lucide-react";

const Verification = () => {
  return (
    <div className=" w-full flex flex-col space-y-2   rounded-2xl   mb-8 ">
      <h2 className="text-lg 2xl:text-xl font-semibold text-vintage-50">
        Personal Information
      </h2>
      <p className="text-sm 2xl:text-base  pb-4 text-gray-700">
        Update your personal information
      </p>
      <div className=" bg-slate-50 shadow-inner shadow-gray-100 p-3 pb-8 md:p-7  rounded-2xl w-full  flex flex-col gap-3 ">
        <div className=" flex items-center gap-4 md:gap-2 p-2 md:p-0">
          <CheckIcon className="" />
          <p className=" uppercase text-sm text-vintage-50  2xl:text-lg  font-bold">
            YOUR ACCOUNT IS ALREADY 2-STEP VERIFIED.
          </p>
        </div>

        {/* <Dialog>
          <DialogTrigger className=" flex items-center px-4 py-2 mt-4 text-sm w-full  justify-center md:w-fit  inner-shadow rounded-lg gap-1 text-white font-semibold 2xl:text-lg ">
            SETUP NOW
          </DialogTrigger>
          <DialogContent className=" bg-primary-100 text-white p-8 border-none">
            <DialogHeader className=" w-full flex flex-col items-center mb-4">
              <DialogTitle className=" text-xl font-bold mb-1">
                ENABLE 2-FACTOR AUTHENTICATION
              </DialogTitle>
              <p className=" text-sm text-center text-[#848BAC]">
                Scan the QR code with an authenticator app such as Google
                Authenticator.
              </p>
            </DialogHeader>
            <Image
              src="/images/QR.png"
              alt="QR Code"
              width={100}
              height={100}
              className=" mx-auto"
            />
            <p className=" my-3 font-bold uppercase w-full text-center text-[#848BAC]">
              Or enter the code below:
            </p>
            <div className=" border-2 border-[#52FC18]/40 bg-[#52FC18]/15 p-3 rounded-2xl w-full  flex flex-col md:flex-row gap-3  items-center justify-between  ">
              <h2 className=" font-bold text-xs md:text-base 2xl:text-lg text-[#848BAC]">
                Code:
                <span className="text-primary-50 ml-1">
                  7HeR0PiCk2LmNOpQ456
                </span>
              </h2>
              <button className=" text-white  w-full md:w-fit  justify-center inner-shadow font-semibold hover:border hover:border-primary-200 uppercase text-xs 2xl:text-base bg-[#333547]  px-5 py-3 rounded-xl   inline-flex items-center gap-3">
                <Image
                  src="/icons/copy.png"
                  alt="Edit"
                  width={18}
                  height={18}
                />
                COPY CODE
              </button>{" "}
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default Verification;
