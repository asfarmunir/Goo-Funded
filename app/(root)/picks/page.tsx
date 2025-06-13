"use client";
import { useCreateBet } from "@/app/hooks/useCreateBet";
import { useGetSports } from "@/app/hooks/useGetSports";
import UserAccount from "@/components/shared/UserAccount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import BetSlip from "./bet-slip";
import {
  americanToDecimalOdds,
  calculateToWin,
  getOriginalAccountValue,
} from "@/lib/utils";
import { accountStore } from "@/app/store/account";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import Parlay from "./parlay";
import { ChevronDown } from "lucide-react";
import GamesTable from "./games";

type oddsType = "american" | "decimal";

interface Bet {
  id: number;
  team: string;
  odds: number;
  pick: number;
  toWin: number;
  oddsFormat: "decimal" | "american";
  home_team: string;
  away_team: string;
  gameDate: string;
  sport: string;
  event: string;
  league: string;
  betDetails: {
    market: string;
    point: number | null;
    description?: string;
    bookmaker: string;
  };
}

// Map sports to their respective icon filenames in public/icons
const sportIcons: Record<string, string> = {
  Soccer: "football.png",
  "American Football": "american-football.png",
  "Aussie Rules": "aussies.png",
  Baseball: "baseball.png",
  Basketball: "basketball.png",
  Boxing: "boxing.png",
  Cricket: "cricket.png",
  Golf: "golf.png",
  "Ice Hockey": "icehockey.png",
  Lacrosse: "lacrosse.png",
  "Mixed Martial Arts": "mma.png",
  Politics: "politics.png",
  "Rugby League": "rugby.png",
};

// Default fallback icon
const DEFAULT_ICON = "trophy.png";

const Page = () => {
  const [tab, setTab] = useState("Soccer");
  const [leagueTab, setLeagueTab] = useState("soccer_italy_serie_a");
  const [oddsFormat, setOddsFormat] = useState<oddsType>("decimal");
  const [featuredMatch, setFeaturedMatch] = useState<any>(null);
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const [toCollect, setToCollect] = useState<string>("0.00");
  const [sports, setSports] = useState<any>([]);
  const [leagues, setLeagues] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [bookmakers, setBookmakers] = useState<any>([
    {
      eventId: "",
      bookmakerName: "",
    },
  ]);

  // SPORTS DATA
  const { data, isPending, isError } = useGetSports();

  // ACCOUNT
  const account = accountStore((state) => state.account);

  // SEARCH FILTER
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // BET SLIP DATA
  const addBet = (bet: Bet) => {
    setSelectedBets([...selectedBets, bet]);
  };
  const removeBet = (id: number, market: string, bookmaker: string) => {
    setSelectedBets(
      selectedBets.filter(
        (bet) =>
          !(
            bet.id === id &&
            bet.betDetails.market === market &&
            bet.betDetails.bookmaker === bookmaker
          )
      )
    );
  };
  const calculateOverallOdds = () => {
    let overallOdds = 1;
    selectedBets.forEach((bet) => {
      const decimalOdds =
        bet.oddsFormat === "american"
          ? americanToDecimalOdds(bet.odds)
          : bet.odds;
      overallOdds *= decimalOdds;
    });
    return overallOdds.toFixed(2);
  };

  const calculateToCollect = () => {
    let overallOdds = 1;
    selectedBets.forEach((bet) => {
      const decimalOdds =
        bet.oddsFormat === "american"
          ? americanToDecimalOdds(bet.odds)
          : bet.odds;
      overallOdds *= decimalOdds;
    });

    if (selectedBets.length === 1) {
      return (
        selectedBets[0].pick +
        selectedBets[0].pick * (overallOdds - 1)
      ).toFixed(2);
    }

    let totalBetAmount = selectedBets.length > 1 ? selectedBets[0].pick : 0;
    const potentialPayout = totalBetAmount * (overallOdds - 1);
    return potentialPayout.toFixed(2);
  };
  const onPickInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    market: string,
    bookmaker: string
  ) => {
    const value = parseFloat(e.target.value) || 0;
    const updatedBets = selectedBets.map((bet) => {
      if (
        bet.id === id &&
        bet.betDetails.market === market &&
        bet.betDetails.bookmaker === bookmaker
      ) {
        return {
          ...bet,
          pick: value,
          toWin: calculateToWin(bet, value),
        };
      }
      return bet;
    });
    setSelectedBets(updatedBets);
  };
  const onParlayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const updatedBets = selectedBets.map((bet, index) => {
      if (index === 0) {
        return {
          ...bet,
          pick: value,
          toWin: calculateToWin(bet, value),
        };
      }
      return {
        ...bet,
        pick: value,
        toWin: calculateToWin(bet, value),
      };
    });
    setSelectedBets(updatedBets);
  };

  useEffect(() => {
    setToCollect(calculateToCollect());
  }, [selectedBets]);

  // TABS MECHANISM
  const changeTab = (tab: string) => {
    setSearch("");
    setSelectedBets([]);
    const leaguesArray = data.filter((sport: any) => sport.group === tab);
    setLeagues(leaguesArray);
    setTab(tab);
    // Set default league to soccer_italy_serie_a for Soccer tab, else first league
    const defaultLeague =
      tab === "Soccer"
        ? leaguesArray.find(
            (league: any) => league.key === "soccer_italy_serie_a"
          )?.key || leaguesArray[0]?.key
        : leaguesArray[0]?.key;
    changeLeagueTab(defaultLeague);
  };

  const changeLeagueTab = (league: string) => {
    setSearch("");
    setSelectedBets([]);
    setLeagueTab(league);
  };

  // ODDS FORMAT
  const changeOddsFormat = (format: oddsType) => {
    setOddsFormat(format);
  };

  // SPORTS DATA
  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        (sport: any) => !sport.key.includes("_winner")
      );
      const sportsArray = filteredData.map((sport: any) => sport.group);
      const uniqueSports = sportsArray.filter(function (item, pos) {
        return sportsArray.indexOf(item) == pos;
      });
      // Sort sports to put Soccer first
      const sortedSports = [
        "Soccer",
        ...uniqueSports.filter((sport: string) => sport !== "Soccer").sort(),
      ];
      setSports(sortedSports);

      // Set initial tab to Soccer and league to soccer_italy_serie_a
      const soccerLeagues = filteredData.filter(
        (sport: any) => sport.group === "Soccer"
      );
      if (soccerLeagues.length > 0) {
        setLeagues(soccerLeagues);
        setTab("Soccer");
        const defaultLeague =
          soccerLeagues.find(
            (league: any) => league.key === "soccer_italy_serie_a"
          )?.key || soccerLeagues[0].key;
        setLeagueTab(defaultLeague);
      } else {
        // Fallback to first sport if Soccer is not available
        const leaguesArray = filteredData.filter(
          (sport: any) => sport.group === uniqueSports[0]
        );
        setLeagues(leaguesArray);
        setTab(uniqueSports[0]);
        setLeagueTab(leaguesArray[0].key);
      }
    }
  }, [data]);

  const findTeamInBets = (team: string, id: number) => {
    return selectedBets.find((bet) => bet.team === team && bet.id === id);
  };

  // PLACE BETS
  const { mutate: placeBet, isPending: placingBet } = useCreateBet({
    onSuccess: (data) => {
      setSelectedBets([]);
      toast.success("Bet placed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const placeBets = async () => {
    if (selectedBets.length === 0) {
      toast.error("No bets selected");
      return;
    }

    // Validate for hedging
    const gameBets: Record<string, Bet[]> = {};
    selectedBets.forEach((bet) => {
      if (!gameBets[bet.id]) gameBets[bet.id] = [];
      gameBets[bet.id].push(bet);
    });

    for (const gameId in gameBets) {
      const betsForGame = gameBets[gameId];
      const markets: Record<string, Bet[]> = {};
      betsForGame.forEach((bet) => {
        if (!markets[bet.betDetails.market])
          markets[bet.betDetails.market] = [];
        markets[bet.betDetails.market].push(bet);
      });
      for (const market in markets) {
        if (markets[market].length > 1) {
          toast.error(
            `Cannot place multiple bets on the same market (${market}) for game ${gameId}.`
          );
          return;
        }
      }
    }

    let alteredBet;
    if (selectedBets.length === 1) {
      const bet = selectedBets[0];
      alteredBet = {
        eventId: [bet.id.toString()],
        sportKey: [bet.league],
        sport: [bet.sport],
        event: [bet.event],
        league: [bet.league],
        team: [bet.team],
        odds: bet.odds,
        pick: bet.pick,
        winnings: bet.toWin,
        oddsFormat: bet.oddsFormat.toUpperCase(),
        gameDate: [new Date(bet.gameDate)],
        betDetails: [bet.betDetails],
      };
    } else {
      const eventIds: string[] = [];
      const sports: string[] = [];
      const events: string[] = [];
      const leagues: string[] = [];
      const teams: string[] = [];
      const gameDates: Date[] = [];
      const betDetails: {
        market: string;
        point: number | null;
        bookmaker: string;
      }[] = [];
      selectedBets.forEach((bet) => {
        eventIds.push(bet.id.toString());
        sports.push(bet.sport);
        events.push(bet.event);
        leagues.push(bet.league);
        teams.push(bet.team);
        gameDates.push(new Date(bet.gameDate));
        betDetails.push(bet.betDetails);
      });
      alteredBet = {
        eventId: eventIds,
        sportKey: leagues,
        sport: sports,
        event: events,
        league: leagues,
        team: teams,
        odds: Number(calculateOverallOdds()),
        pick: selectedBets[0].pick,
        winnings: Number(calculateToCollect()),
        oddsFormat: "DECIMAL",
        gameDate: gameDates,
        betDetails: betDetails,
      };
    }

    if (!alteredBet) return;

    placeBet({
      bet: alteredBet,
      accountNumber: account.accountNumber,
    });
  };

  return (
    <div className="w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-4">
      <div className="w-full flex md:hidden items-center justify-between">
        <UserAccount />
      </div>

      {isPending ? <SkeletonLoader /> : null}
      {!isPending && (
        <>
          <SportsTabs sports={sports} tab={tab} changeTab={changeTab} />
        </>
      )}

      <div className="flex relative overflow-visible gap-4 flex-col-reverse md:flex-row items-start">
        <div className="w-full flex gap-4 flex-col rounded-2xl mb-8 items-start">
          <div className="w-full bg-white shadow-inner shadow-gray-200 rounded-xl p-5 py-7 flex-col md:flex-row flex items-center justify-between gap-4">
            <div className="flex flex-col items-start justify-start w-full md:w-fit">
              <h3 className="text-lg 2xl:text-2xl font-bold mb-1">Featured</h3>
              <p className="text-xs 2xl:text-base text-[#848BAC] max-w-md">
                Don't miss out on exclusive boosted odds and special in-play
                betting options available only for this feature event.
              </p>
            </div>
            <div className="flex w-full md:w-fit items-center gap-2 flex-col md:flex-row">
              <button
                className={`flex cursor-default justify-center items-center p-4 text-sm w-full md:w-fit 2xl:text-base bg-vintage-50 text-white rounded-full ${
                  findTeamInBets(featuredMatch?.home_team, featuredMatch?.id)
                    ? "shadow shadow-blue-800"
                    : ""
                }`}
              >
                {featuredMatch?.home_team}
              </button>
              <p className="p-1.5 cursor-default text-sm px-2 rounded-full font-bold -mx-3 -my-4 z-30 text-vintage-50 bg-blue-900/30 border-blue-900/40 border-2">
                vs
              </p>
              <button
                className={`flex justify-center items-center p-4 text-sm w-full md:w-fit 2xl:text-base bg-vintage-50 text-white rounded-full ${
                  findTeamInBets(featuredMatch?.away_team, featuredMatch?.id)
                    ? "shadow shadow-blue-800"
                    : ""
                }`}
              >
                {featuredMatch?.away_team}
              </button>
            </div>
          </div>
          <div className="w-full transition-all border border-gray-200 rounded-xl bg-[#F8F8F8] flex flex-col">
            <div className="flex flex-col md:flex-row w-full items-center justify-between">
              <div className="flex items-center gap-3 w-full p-2 md:p-6 md:pr-32">
                {!isPending && (
                  <LeaguesTabs
                    leagues={leagues}
                    leagueTab={leagueTab}
                    changeLeagueTab={changeLeagueTab}
                  />
                )}
                <div className="bg-white border border-slate-100 inline-flex items-center py-1 px-2.5 rounded-full">
                  <LuSearch className="w-6 h-6 text-[#848BAC]" />
                  <Input
                    className="bg-transparent text-[#848BAC] focus:outline-0 focus:ring-0 focus:border-none placeholder-slate-900 uppercase 2xl:w-80"
                    placeholder="search..."
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-white font-bold justify-center w-[95%] text-sm 2xl:text-base md:w-fit p-3.5 py-3 md:mr-3 rounded-full inline-flex items-center gap-2">
                  <span className="text-[#737897] capitalize">Odds:</span>
                  {oddsFormat}
                  <FaAngleDown className="text-lg ml-0.5 mb-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white text-vintage-50 border-none mt-1 p-3 rounded-lg text-xs 2xl:text-base">
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() => changeOddsFormat("decimal")}
                  >
                    <p>Decimal</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onClick={() => changeOddsFormat("american")}
                  >
                    <p>American</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {account && (
              <GamesTable
                tab={tab}
                sportKey={leagueTab}
                oddsFormat={oddsFormat}
                addBet={addBet}
                bets={selectedBets}
                setFeaturedMatch={setFeaturedMatch}
                account={account}
                search={search}
                bookmakers={bookmakers}
                setBookmakers={setBookmakers}
              />
            )}
          </div>
        </div>
        <div className="w-full md:w-[40%] sticky top-4 border border-gray-200 p-4 rounded-xl bg-white flex flex-col">
          <div className="flex items-start gap-4 mb-5 md:items-center justify-between flex-col md:flex-row w-full">
            <h2 className="font-bold text-lg capitalize">Betting Slip</h2>
            <div className="flex items-center border-gray-[#737897] rounded-lg bg-[#737897]/20">
              <button
                className={`${
                  selectedBets.length === 1
                    ? "text-vintage-50"
                    : "text-primary-200"
                } text-xs font-bold p-2 px-3 border-r border-gray-200`}
              >
                Single
              </button>
              <button
                className={`text-xs font-bold p-2 px-3 ${
                  selectedBets.length > 1
                    ? "text-vintage-50"
                    : "text-primary-200"
                }`}
              >
                Parlay
              </button>
            </div>
          </div>

          {selectedBets.length === 0 && (
            <div className="flex items-center justify-center h-48 w-full">
              <p className="text-[#848BAC] text-sm 2xl:text-lg capitalize">
                No bets selected
              </p>
            </div>
          )}

          {account && selectedBets.length === 1
            ? selectedBets.map((bet, index) => (
                <BetSlip
                  key={`${bet.id}-${bet.betDetails.market}-${bet.betDetails.bookmaker}`}
                  bet={bet}
                  removeBet={removeBet}
                  onPickInputChange={onPickInputChange}
                />
              ))
            : account &&
              selectedBets.length > 1 && (
                <Parlay
                  selectedBets={selectedBets}
                  onPickInputChange={onParlayInputChange}
                  toWin={toCollect}
                  removeBet={removeBet}
                />
              )}
          <div className="w-full mt-3 border-t border-gray-200 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">Overall Odds</p>
            <p className="font-bold">{calculateOverallOdds()}</p>
          </div>
          <div className="w-full mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">To Collect</p>
            <p className="font-bold">{toCollect} USD</p>
          </div>

          <div className="w-full border-t border-gray-200 py-3 flex items-center justify-between">
            <button
              className="p-3.5 px-8 capitalize font-bold text-xs 2xl:text-sm rounded-full border-2 border-vintage-50"
              onClick={() => setSelectedBets([])}
            >
              Clear
            </button>
            <button
              className="p-3.5 px-8 bg-vintage-50 text-white capitalize border-2 border-vintage-50 font-bold text-xs 2xl:text-sm rounded-full disabled:opacity-50"
              disabled={placingBet}
              onClick={placeBets}
            >
              {placingBet ? "Placing bet..." : "Place Pick"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const SkeletonLoader = () => {
  return (
    <div className="flex mt-4 items-center pb-3 max-w-full overflow-auto justify-evenly md:justify-start gap-2 mb-3">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-600 animate-pulse w-full min-w-16 md:w-fit flex-grow md:flex-grow-0 rounded-full px-4 py-2 h-10"
        ></div>
      ))}
    </div>
  );
};

const SportsTabs = ({
  sports,
  tab,
  changeTab,
}: {
  sports: any;
  tab: string;
  changeTab: (sport: string) => void;
}) => {
  console.log("🚀 ~ sports:", sports);
  return (
    <div className="flex bg-white items-center p-4 2xl:p-5 rounded-2xl max-w-full overflow-auto justify-evenly gap-2 mb-3">
      {sports?.map((sport: any, index: number) => (
        <button
          key={index}
          className={`px-6 text-xs w-68 2xl:text-base py-3 flex justify-center font-bold text-nowrap items-center flex-grow md:flex-grow-0 rounded-full gap-2 ${
            tab === sport ? "bg-[#0100821A] border" : ""
          } capitalize`}
          onClick={() => changeTab(sport)}
        >
          <Image
            src={`/sports/${sportIcons[sport] || DEFAULT_ICON}`}
            alt={`${sport} icon`}
            width={20}
            height={20}
            className="object-contain"
          />
          {sport}
        </button>
      ))}
    </div>
  );
};

const LeaguesTabs = ({
  leagues,
  leagueTab,
  changeLeagueTab,
}: {
  leagues: any;
  leagueTab: string;
  changeLeagueTab: (league: string) => void;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center p-3.5 px-5 2xl:px-8 gap-4 bg-white rounded-full">
            <p className="text-xs 2xl:text-sm font-bold">
              {leagues?.find((league: any) => league.key === leagueTab)?.title}
            </p>
            <ChevronDown />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-96 overflow-y-auto">
          {leagues?.map((league: any, index: number) =>
            (league.title as string).toLowerCase().includes("winner") ? null : (
              <DropdownMenuItem
                key={index}
                onClick={() => changeLeagueTab(league.key)}
              >
                {league.title}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
