import Image from "next/image";
import React from "react";
import { Bet } from "./page";

const BetSlip = ({
  bet,
  removeBet,
  onPickInputChange,
}: {
  bet: Bet;
  removeBet: (id: number) => void;
  onPickInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => void;
}) => {
  const calculateMoneyLine = (
    odds: number,
    oddsFormat: "decimal" | "american",
    pick: number
  ) => {
    let americanOdds = odds;
    if (oddsFormat === "decimal") {
      americanOdds = decimalToAmericanOdds(odds);
    }
    if (americanOdds > 0) {
      return `+${(pick * (americanOdds / 100)).toFixed(2)}`;
    } else {
      return `-${(pick * (100 / Math.abs(americanOdds))).toFixed(2)}`;
    }
  };

  const decimalToAmericanOdds = (decimalOdds: number) => {
    if (decimalOdds >= 2) {
      // Positive American odds
      return (decimalOdds - 1) * 100;
    } else {
      // Negative American odds
      return -100 / (decimalOdds - 1);
    }
  };
  return (
    <div className="py-4">
      <div className=" w-full mb-4 flex items-center justify-between">
        <div className="flex flex-col  gap-2">
          <p className=" capitalize 2xl:text-[0.95rem]  text-sm">
            {bet.market}{" "}
            <span className="text-white text-opacity-40">
              {"("}
              {bet.oddsFormat}
              {" format )"}
            </span>
          </p>
          <p className="text-sm  capitalize 2xl:text-[0.95rem] ">
            <span className="font-semibold pr-2">Selected Bet: </span>
            {bet.bet}
          </p>
          <p className="text-sm  capitalize 2xl:text-[0.95rem] ">
            <span className="font-semibold pr-2">Event: </span>
            {bet.event}
          </p>
        </div>
        <button onClick={() => removeBet(bet.id)}>
          <Image
            src="/icons/discard.png"
            alt="Arrow Icon"
            width={23}
            height={23}
          />
        </button>
      </div>
      <div className=" w-full mb-4  rounded-xl text-green-700 bg-[#52FC18]/20 p-3 px-4 flex border border-green-300 items-center justify-between">
        <p className="text-sm font-thin capitalize">money line</p>
        <p className="font-bold">
          {calculateMoneyLine(bet.odds, bet.oddsFormat, bet.pick)}
        </p>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="bg-vintage-50 text-white rounded-xl p-3.5 flex flex-col w-full gap-2.5 flex-grow">
          <p className=" text-xs font-thin ">Pick</p>
          <div className="flex gap-2 items-center">
            <input
              className=" font-bold bg-transparent focus:outline-none border-2 border-transparent w-full hover:border-white  rounded-sm px-2 py-1"
              // value={bet.pick.toFixed(2)}
              defaultValue={bet.pick.toFixed(2)}
              onChange={(e) => onPickInputChange(e, bet.id)}
              type="number"
            />
            <p className="font-bold">$</p>
          </div>
        </div>
        <div className="bg-vintage-50 rounded-xl text-white p-3.5  flex flex-col w-full gap-2.5 flex-grow">
          <p className=" text-xs font-thin py-[0.370rem] ">To Win</p>
          <h2 className=" font-bold">{bet.toWin.toFixed(2)}$</h2>
        </div>
      </div>
    </div>
  );
};

export default BetSlip;
