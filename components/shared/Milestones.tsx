import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Milestones() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" bg-[#001E451A] px-8 text-[10px] md:text-base border font-semibold rounded-full py-3.5">
          View Milestones
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1105px] 2xl:max-w-[1250px]">
        <DialogHeader>
          <DialogTitle className="text-xl border-b border-slate-200 pb-4 w-full">
            MileStones
          </DialogTitle>
        </DialogHeader>

        <div className=" w-full flex flex-wrap items-center  md:gap-3  justify-center  ">
          <Image
            src="/vintage/images/milestone1.svg"
            width={300}
            height={300}
            alt="Milestones"
            className="
            w-[200px] h-[200px] md:w-[350px] md:h-[350px] "
          />
          <Image
            src="/vintage/images/milestone2.svg"
            width={300}
            height={300}
            alt="Milestones"
            className="
            w-[200px] h-[200px] md:w-[350px] md:h-[350px] "
          />
          <Image
            src="/vintage/images/milestone3.svg"
            width={300}
            height={300}
            alt="Milestones"
            className="
            w-[200px] h-[200px] md:w-[350px] md:h-[350px] "
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
