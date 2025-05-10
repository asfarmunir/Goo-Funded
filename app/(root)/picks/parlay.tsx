import Image from "next/image";
import React from "react";

interface Bet {
  id: number;
  team: string;
  odds: number;
  pick: number;
  toWin: number;
  oddsFormat: "decimal" | "american";
  home_team: string;
  away_team: string;
  sport: string;
  event: string;
}

const Parlay = ({
  selectedBets,
  toWin,
  onPickInputChange,
  onRemove,
}: {
  selectedBets: Bet[];
  toWin: string;
  onRemove: () => void;
  onPickInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const bet = selectedBets[0];

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
      <div className=" w-full mb-4 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          {selectedBets.map((bet) => (
            <div key={bet.id} className="flex items-center gap-2">
              <p className="uppercase  text-sm">
                {bet.team}{" "}
                <span className="text-white text-opacity-40">
                  {"("}
                  {bet.oddsFormat}
                  {" format )"}
                </span>
              </p>
            </div>
          ))}
        </div>
        <button onClick={onRemove}>
          <Image
            src="/icons/discard.png"
            alt="Arrow Icon"
            width={23}
            height={23}
          />
        </button>
      </div>
      <div className=" w-full mb-4  rounded-xl text-vintage-50 bg-[#0100821A] p-3 flex items-center justify-between">
        <p className="text-sm font-semibold capitalize">money line</p>
        <p className="font-bold">
          {calculateMoneyLine(
            selectedBets[0].odds,
            selectedBets[0].oddsFormat,
            selectedBets[0].pick
          )}
        </p>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 flex shadow-sm flex-col gap-2.5 flex-grow">
          <p className=" text-xs font-thin text-vintage-50">Pick</p>
          <div className="flex gap-2">
            <input
              className=" font-bold  focus:outline-none border border-transparent focus:border-vintage-50/30 w-24 bg-white rounded-sm px-2"
              value={bet.pick.toFixed(2)}
              //   defaultValue={bet.pick.toFixed(2)}
              onChange={onPickInputChange}
              type="number"
            />
            <p className="font-bold">$</p>
          </div>
        </div>
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 flex shadow-sm flex-col gap-2.5 flex-grow">
          <p className=" text-xs font-thin text-vintage-50">To Win</p>
          <h2 className=" font-bold">{toWin}$</h2>
        </div>
      </div>
    </div>
  );
};

export default Parlay;
