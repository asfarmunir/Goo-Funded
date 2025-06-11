import React from "react";
import { Trash2 } from "lucide-react";

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
  league: string;
  betDetails: {
    market: string;
    point: number | null;
    bookmaker: string;
  };
}

const Parlay = ({
  selectedBets,
  toWin,
  onPickInputChange,
  removeBet,
}: {
  selectedBets: Bet[];
  toWin: string;
  onPickInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBet: (id: number, market: string, bookmaker: string) => void;
}) => {
  const formatOdds = (odds: number, oddsFormat: "decimal" | "american") => {
    if (oddsFormat === "american") {
      return odds > 0 ? `+${odds}` : odds;
    }
    return odds.toFixed(2);
  };

  const calculateMoneyLine = (
    odds: number,
    oddsFormat: "decimal" | "american",
    pick: number
  ) => {
    let americanOdds = odds;
    if (oddsFormat === "decimal") {
      americanOdds = odds >= 2 ? (odds - 1) * 100 : -100 / (odds - 1);
    }
    if (americanOdds > 0) {
      return `+${(pick * (americanOdds / 100)).toFixed(2)}`;
    } else {
      return `-${(pick * (100 / Math.abs(americanOdds))).toFixed(2)}`;
    }
  };

  const getMarketDisplay = (market: string) => {
    switch (market) {
      case "h2h":
        return "Moneyline";
      case "spreads":
        return "Spread";
      case "totals":
        return "Total";
      default:
        return market;
    }
  };

  return (
    <div className="py-4">
      <div className="w-full mb-4 flex flex-col gap-4">
        {selectedBets.map((bet) => (
          <div
            key={`${bet.id}-${bet.betDetails.market}-${bet.betDetails.bookmaker}`}
            className="flex items-start justify-between border-b border-gray-200 pb-2"
          >
            <div className="flex flex-col gap-1">
              <p className="capitalize font-semibold text-base text-vintage-50">
                {bet.team} ({getMarketDisplay(bet.betDetails.market)})
              </p>
              <p className="text-xs text-[#848BAC]">
                {bet.betDetails.point !== null
                  ? `${bet.betDetails.point > 0 ? "+" : ""}${
                      bet.betDetails.point
                    }`
                  : ""}
                {bet.betDetails.point !== null ? " • " : ""}
                {bet.betDetails.bookmaker}
              </p>
              <p className="text-sm text-vintage-50">
                Odds: {formatOdds(bet.odds, bet.oddsFormat)}
              </p>
              <p className="text-sm text-vintage-50">
                Money Line:{" "}
                {calculateMoneyLine(bet.odds, bet.oddsFormat, bet.pick)} USD
              </p>
            </div>
            <button
              onClick={() =>
                removeBet(
                  bet.id,
                  bet.betDetails.market,
                  bet.betDetails.bookmaker
                )
              }
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 flex shadow-sm flex-col gap-2.5 flex-grow">
          <p className="text-xs font-thin text-vintage-50">Pick</p>
          <div className="flex gap-2 items-center">
            <input
              className="font-bold focus:outline-none border border-transparent focus:border-vintage-50/30 w-24 bg-white rounded-sm px-2"
              value={selectedBets[0].pick.toFixed(2)}
              onChange={onPickInputChange}
              type="number"
              step="0.01"
            />
            <p className="font-bold">$</p>
          </div>
        </div>
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 flex shadow-sm flex-col gap-2.5 flex-grow">
          <p className="text-xs font-thin text-vintage-50">To Win</p>
          <h2 className="font-bold">{toWin}$</h2>
        </div>
      </div>
    </div>
  );
};

export default Parlay;
