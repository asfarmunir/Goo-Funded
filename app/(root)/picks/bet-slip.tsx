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

const BetSlip = ({
  bet,
  removeBet,
  onPickInputChange,
}: {
  bet: Bet;
  removeBet: (id: number, market: string, bookmaker: string) => void;
  onPickInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    market: string,
    bookmaker: string
  ) => void;
}) => {
  const formatOdds = (odds: number, oddsFormat: "decimal" | "american") => {
    if (oddsFormat === "american") {
      return odds > 0 ? `+${odds}` : odds;
    }
    return odds.toFixed(2);
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
    <div className="py-4 border-b border-gray-200">
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="capitalize font-semibold text-base text-vintage-50">
            {bet.team} ({getMarketDisplay(bet.betDetails.market)})
          </p>
          <p className="text-xs text-[#848BAC]">
            {bet.betDetails.point !== null
              ? `${bet.betDetails.point > 0 ? "+" : ""}${bet.betDetails.point}`
              : ""}
            {bet.betDetails.point !== null ? " • " : ""}
            {bet.betDetails.bookmaker}
          </p>
          <p className="text-sm text-vintage-50">
            Odds: {formatOdds(bet.odds, bet.oddsFormat)}
          </p>
        </div>
        <button
          onClick={() =>
            removeBet(bet.id, bet.betDetails.market, bet.betDetails.bookmaker)
          }
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 text-vintage-50 flex flex-col gap-2.5 flex-grow">
          <p className="text-xs font-thin">Pick</p>
          <div className="flex gap-2 items-center">
            <input
              className="font-bold bg-white focus:outline-none border border-transparent text-vintage-50 w-24 rounded-sm px-2"
              defaultValue={bet.pick.toFixed(2)}
              onChange={(e) =>
                onPickInputChange(
                  e,
                  bet.id,
                  bet.betDetails.market,
                  bet.betDetails.bookmaker
                )
              }
              type="number"
              step="0.01"
            />
            <p className="font-bold">$</p>
          </div>
        </div>
        <div className="bg-[#F9F9F9] rounded-xl p-3.5 text-vintage-50 flex flex-col gap-2.5 flex-grow">
          <p className="text-xs font-thin">To Win</p>
          <h2 className="font-bold">{bet.toWin.toFixed(2)}$</h2>
        </div>
      </div>
    </div>
  );
};

export default BetSlip;
