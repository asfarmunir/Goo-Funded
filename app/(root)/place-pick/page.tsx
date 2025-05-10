"use client";
import { useCreateBet } from "@/app/hooks/useCreateBet";
import { useGetAccount } from "@/app/hooks/useGetAccount";
import { useGetSports } from "@/app/hooks/useGetSports";
import BetModal from "@/components/shared/BetModal";
import Navbar from "@/components/shared/Navbar";
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
import { MdOutlineArrowUpward } from "react-icons/md";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import BetSlip from "./bet-slip";
import NewGamesTable from "./newGames";
import {
  americanToDecimalOdds,
  calculateToWin,
  getOriginalAccountValue,
} from "@/lib/utils";
import { accountStore } from "@/app/store/account";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import Parlay from "./parlay";
import MorePicks from "@/components/shared/MorePicks";
import { ChevronDown } from "lucide-react";

type oddsType = "american" | "decimal";

export interface Bet {
  id: number;
  marketId: number;
  matchId: number;
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
  bet: string;
  market: string;
}
const page = () => {
  const [newTab, setnewTab] = useState(1);
  const [newLeagueTab, setNewLeagueTab] = useState("");
  const [newSports, setNewSports] = useState<any>([]);
  const [newLeagues, setNewLeagues] = useState<any>([]);
  const [tab, setTab] = useState("football");
  const [loading, setLoading] = useState(true);
  const [leagueTab, setLeagueTab] = useState("");
  const [oddsFormat, setOddsFormat] = useState<oddsType>("decimal");
  const [featuredMatch, setFeaturedMatch] = useState<any>(null);
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const [toCollect, setToCollect] = useState<string>("0.00");
  const [sports, setSports] = useState<any>([]);
  const [leagues, setLeagues] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [userHasAccounts, setUserHasAccounts] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [matchStatus, setMatchStatus] = useState<string>("pre-match");
  const [detailedMatchId, setDetailedMatchId] = useState<number | null>(null);

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
  const removeBet = (id: number) => {
    setSelectedBets(selectedBets.filter((bet) => bet.id !== id));
  };
  const calculateOverallOdds = () => {
    let overallOdds = 1;

    // Multiply odds for each bet
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

    // Multiply odds for each bet
    selectedBets.forEach((bet) => {
      const decimalOdds =
        bet.oddsFormat === "american"
          ? americanToDecimalOdds(bet.odds)
          : bet.odds;
      overallOdds *= decimalOdds;
    });

    // single bet
    if (selectedBets.length === 1) {
      return (
        selectedBets[0].pick +
        selectedBets[0].pick * (overallOdds - 1)
      ).toFixed(2);
    }

    // For parlays
    let totalBetAmount = selectedBets.length > 1 ? selectedBets[0].pick : 0;

    // Calculate parlay payout: betAmount * (overallOdds - 1)
    const potentialPayout = totalBetAmount * (overallOdds - 1);

    return potentialPayout.toFixed(2); // Return net profit from parlay
  };
  const onPickInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = parseFloat(e.target.value);
    const updatedBets = selectedBets.map((bet) => {
      if (bet.id === id) {
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
    const value = parseFloat(e.target.value);
    const updatedBets = selectedBets.map((bet, index) => {
      if (index === 0) {
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

  useEffect(() => {
    setToCollect(calculateToCollect());
  }, [selectedBets]);

  // TABS MECHANISM
  const changeTab = (tab: string) => {
    // reset search
    setSearch("");

    // reset selected bets
    setSelectedBets([]);

    const leaguesArray = data.filter((sport: any) => sport.group === tab);
    setLeagues(leaguesArray);
    setTab(tab);
    changeLeagueTab(leaguesArray[0].key);
  };

  const changeLeagueTab = (league: string) => {
    // reset search
    setSearch("");

    // reset selected bets
    setSelectedBets([]);
    setLeagueTab(league);
  };

  const getNewSports = async (sportId?: number) => {
    setLoading(true);
    console.log("🚀 ~ getNewSports ~ sportId");

    const res = await fetch("/api/sports/get-all-sports");
    if (!res.ok) {
      toast.error("Failed to fetch sports");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setnewTab(sportId || data.sports[0].Id);
    setNewSports(data.sports);
    const leagues = await fetch("/api/sports/get-leagues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sportId || data.sports[0].Id),
    });
    if (!leagues.ok) {
      toast.error("Failed to fetch leagues");
      setLoading(false);
      return;
    }
    const leaguesData = await leagues.json();
    if (leaguesData.leagues.length > 0) {
      setNewLeagues(leaguesData.leagues);
      setNewLeagueTab(leaguesData.leagues[0].Id);
    }
    setLoading(false);
  };

  // SPORTS DATA
  useEffect(() => {
    getNewSports();

    if (data) {
      const filteredData: string[] = data.filter(
        (sport: any) => !sport.key.includes("_winner")
      );
      const sportsArray = filteredData.map((sport: any) => sport.group);
      const uniqueSports = sportsArray.filter(function (item, pos) {
        return sportsArray.indexOf(item) == pos;
      });
      setSports(uniqueSports);

      const leaguesArray = data.filter(
        (sport: any) => sport.group === uniqueSports[0]
      );
      setLeagues(leaguesArray);

      changeTab(uniqueSports[0]);
      changeLeagueTab(leaguesArray[0].key);
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

    let alteredBet;
    if (selectedBets.length === 1) {
      const bet = selectedBets[0];

      alteredBet = {
        eventId: [bet.matchId.toString()],
        //@ts-ignore
        bets: [
          {
            marketId: bet.marketId.toString(),
            marketName: bet.market.toString(),
            betIdInMarket: bet.id.toString(),
            fixtureId: bet.matchId.toString(),
            selectedBet: bet.bet,
            odds: bet.odds,
          },
        ],
        sportKey: [bet.league],
        sport: [bet.sport],
        event: [bet.event],
        league: [bet.league],
        team: [bet.team], // [Iowa, Ohio Bobcats]
        odds: bet.odds,
        pick: bet.pick,
        winnings: bet.toWin,
        oddsFormat: bet.oddsFormat.toUpperCase(),
        gameDate: [new Date(bet.gameDate)], // [7 dec, 8 dec]
      };
    } else if (selectedBets.length > 1) {
      const eventIds: string[] = [];
      const sports: string[] = [];
      const events: string[] = [];
      const leagues: string[] = [];
      const teams: string[] = [];
      const gameDates: Date[] = [];
      selectedBets.forEach((bet) => {
        eventIds.push(bet.matchId.toString());
        sports.push(bet.sport);
        events.push(bet.event);
        leagues.push(bet.league);
        teams.push(bet.team);
        gameDates.push(new Date(bet.gameDate));
      });
      const bets = selectedBets.map((bet) => ({
        marketId: bet.marketId.toString(),
        marketName: bet.market.toString(),
        betIdInMarket: bet.id.toString(),
        selectedBet: bet.bet,
        fixtureId: bet.matchId.toString(),
        odds: bet.odds,
      }));
      alteredBet = {
        eventId: eventIds,
        bets,
        sportKey: leagues,
        sport: sports,
        event: events,
        league: leagues,
        team: teams,
        odds: Number(calculateOverallOdds()),
        pick: selectedBets[0].pick, // we are storing total pick amount of parlay in the first bet.
        winnings: Number(calculateToCollect()),
        oddsFormat: "DECIMAL",
        gameDate: gameDates,
      };
    }

    if (!alteredBet) return;
    console.log("🚀 ~ placeBets ~ alteredBet", alteredBet);

    placeBet({
      bet: alteredBet,
      accountNumber: account.accountNumber,
      // accountNumber: "",
    });
  };

  return (
    <>
      <div className=" w-full p-2 md:p-3 rounded-2xl bg-vintage-50 space-y-4 min-h-svh">
        <div className=" w-full flex md:hidden items-center justify-between">
          <UserAccount />
        </div>
        {!showDetails && loading ? <SkeletonLoader /> : null}
        {!showDetails && !loading && (
          <>
            <NewSportsTabs
              sports={newSports}
              tab={newTab}
              changeTab={setnewTab}
              getNewSports={getNewSports}
            />
            {/* <LeaguesTabs
              leagues={leagues}
              leagueTab={leagueTab}
              changeLeagueTab={changeLeagueTab}
            /> */}
          </>
        )}
        {!showDetails && featuredMatch && (
          <div className="w-full bg-white shadow-inner shadow-gray-200 rounded-xl p-5 py-7 flex-col md:flex-row  flex items-center justify-between gap-4">
            <div className="flex flex-col  items-start justify-start  w-full md:w-fit  ">
              <h3 className="text-lg 2xl:text-2xl font-bold mb-1">Featured</h3>
              <p className="  text-xs 2xl:text-base text-[#848BAC] max-w-md">
                Don't miss out on exclusive boosted odds and special in-play
                betting options available only for this feature event.
              </p>
            </div>
            <div className="flex w-full md:w-fit items-center gap-2 flex-col md:flex-row">
              <button
                className={`flex justify-center items-center p-4 text-sm w-full md:w-fit 2xl:text-base  bg-vintage-50 text-white  rounded-full ${
                  findTeamInBets(featuredMatch?.home_team, featuredMatch?.id)
                    ? "  shadow shadow-blue-800"
                    : ""
                }`}
              >
                {/* {featuredMatch && featuredMatch?.home.logo !== "" && (
                  <Image
                    src={featuredMatch?.home.logo}
                    alt={featuredMatch?.home.name}
                    width={20}
                    className="  w-[32px] h-[32px] object-contain object-center"
                    height={20}
                  />
                )} */}
                {featuredMatch.Fixture.Participants[0].Name}
              </button>
              <p className=" p-1.5 text-sm px-2 rounded-full font-bold -mx-3 -my-4 z-30 text-vintage-50 bg-blue-900/30 border-blue-900/40 border-2">
                vs
              </p>
              <button
                className={`flex justify-center items-center p-4 text-sm w-full md:w-fit 2xl:text-base  bg-vintage-50 text-white  rounded-full ${
                  findTeamInBets(featuredMatch?.away_team, featuredMatch?.id)
                    ? "  shadow shadow-blue-800"
                    : ""
                }`}
              >
                {featuredMatch.Fixture.Participants[1].Name}
              </button>

              <button
                className="flex justify-center border-4 border-vintage-50
                   items-center gap-2 p-4 px-8 text-sm w-full md:w-fit 2xl:text-base font-black bg-white  rounded-full "
                onClick={() => {
                  setShowDetails(true);
                  setDetailedMatchId(featuredMatch.FixtureId);
                }}
              >
                Place Picks
              </button>
            </div>
          </div>
        )}

        <div className=" relative w-full flex gap-5 flex-col-reverse md:flex-row rounded-2xl mb-8 items-start">
          {!showDetails ? (
            <div className=" w-full transition-all border border-gray-200 rounded-xl bg-[#F8F8F8]  flex flex-col">
              <div className="flex flex-col md:flex-row  mb-4 w-full items-center justify-between">
                <div className="flex  items-center gap-3 w-full p-2 md:p-6 md:pr-32 ">
                  {!loading && (
                    <>
                      <NewLeaguesTabs
                        leagues={newLeagues}
                        leagueTab={newLeagueTab}
                        changeLeagueTab={setNewLeagueTab}
                      />
                    </>
                  )}
                  <div className=" bg-white border border-slate-100 inline-flex  items-center py-1 px-2.5 rounded-full">
                    <LuSearch className="w-6 h-6 text-[#848BAC] " />
                    <Input
                      className=" 
                bg-transparent
                text-[#848BAC]

                focus:outline-0
                focus:ring-0
                focus:border-none
                placeholder-slate-900 
                uppercase
                "
                      placeholder={"search..."}
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>
                  {/* <button
                    onClick={() => setMatchStatus("live")}
                    className={`
                       ${
                         matchStatus === "live"
                           ? "shadow shadow-green-700 border border-primary-50/80"
                           : ""
                       }
                        bg-[#393C53]  font-bold   justify-center w-[95%] text-sm 2xl:text-base md:w-fit  p-3 px-7 md:mr-1 rounded-xl inline-flex items-center gap-2 uppercase`}
                  >
                    LIVE GAMES
                  </button>
                  <button
                    onClick={() => setMatchStatus("pre-match")}
                    className={`
                       ${
                         matchStatus === "pre-match"
                           ? "shadow shadow-green-700 border border-primary-50/80"
                           : ""
                       }
                        bg-[#393C53]  font-bold   justify-center w-[95%] text-sm 2xl:text-base md:w-fit  p-3 px-7 md:mr-3  rounded-xl inline-flex items-center gap-2 uppercase`}
                  >
                    PRE-GAMES
                  </button> */}
                </div>
              </div>
              {account && tab && newLeagueTab && (
                <>
                  <NewGamesTable
                    tab={newTab.toString()}
                    leagueTab={newLeagueTab}
                    oddsFormat={oddsFormat}
                    addBet={addBet}
                    bets={selectedBets}
                    setBets={setSelectedBets}
                    setFeaturedMatch={setFeaturedMatch}
                    account={account}
                    search={search}
                    setShowDetails={setShowDetails}
                    matchStatus={matchStatus}
                    setDetailedMatchId={setDetailedMatchId}
                  />
                  {/* <GamesTable
                    tab={tab}
                    sportKey={leagueTab}
                    oddsFormat={oddsFormat}
                    addBet={addBet}
                    bets={selectedBets}
                    setBets={setSelectedBets}
                    setFeaturedMatch={setFeaturedMatch}
                    account={account}
                    search={search}
                    setShowDetails={setShowDetails}
                  /> */}
                </>
              )}
              {!account ||
                !tab ||
                (!newLeagueTab && (
                  <div className="flex items-center justify-center h-48 pb-12 w-full">
                    <p className="text-[#848BAC] text-sm 2xl:text-base text-center  ">
                      We are unable to fetch games at the moment. <br /> Please
                      try again later.
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <MorePicks
              tab={newTab}
              sportName={
                newSports.find((sport: any) => sport.Id === newTab)?.Name
              }
              leagueTab={newLeagueTab}
              setShowDetails={setShowDetails}
              matchId={detailedMatchId!}
              sportsId={newTab}
              leagueId={newLeagueTab}
              bets={selectedBets}
              setBets={setSelectedBets}
              addBet={addBet}
              account={account}
            />
          )}
          {selectedBets.length > 0 && (
            // <div
            //   className={` w-full sticky top-5 transition-all md:w-[65%]  border border-gray-700 p-4 rounded-xl bg-primary-100  flex flex-col`}
            // >
            //   <div className="flex items-start gap-4 mb-8 md:items-center justify-between md:mb-5  flex-col md:flex-row w-full">
            //     <h2 className="font-bold text-lg uppercase">betting slip</h2>
            //     <div className="flex items-center border-gray-[#737897] rounded-lg bg-[#737897]/20">
            //       <button
            //         className={` ${
            //           selectedBets.length === 1
            //             ? "text-vintage-50"
            //             : "text-primary-200"
            //         } text-xs font-bold p-2p px-3  uppercase border-r border-gray-700`}
            //       >
            //         single
            //       </button>
            //       <button
            //         className={`text-xs font-bold p-2 px-3 uppercase ${
            //           selectedBets.length > 1
            //             ? "text-vintage-50"
            //             : "text-primary-200"
            //         }`}
            //       >
            //         parlay
            //       </button>
            //     </div>
            //   </div>

            //   {selectedBets.length === 0 && (
            //     <div className="flex items-center justify-center h-96 w-full">
            //       <p className="text-[#848BAC] text-sm 2xl:text-lg uppercase">
            //         No bets selected
            //       </p>
            //     </div>
            //   )}

            //   {account && selectedBets.length === 1
            //     ? selectedBets.map((bet, index) => (
            //         <>
            //           <BetSlip
            //             key={index}
            //             bet={bet}
            //             removeBet={removeBet}
            //             onPickInputChange={onPickInputChange}
            //           />
            //         </>
            //       ))
            //     : account &&
            //       selectedBets.length > 1 && (
            //         <>
            //           <Parlay
            //             selectedBets={selectedBets}
            //             onPickInputChange={onParlayInputChange}
            //             toWin={toCollect}
            //             onRemove={() => setSelectedBets([])}
            //           />
            //         </>
            //       )}
            //   <div className=" w-full  mt-3 border-t border-gray-700 py-3 flex items-center justify-between">
            //     <p className="text-sm  text-primary-200 font-thin     ">
            //       OVERALL ODDS
            //     </p>
            //     <p className="font-bold">{calculateOverallOdds()}</p>
            //   </div>
            //   <div className=" w-full mb-4  flex items-center - justify-between">
            //     <p className="text-sm  text-primary-200 font-thin     ">
            //       TO COLLECT
            //     </p>
            //     <p className="font-bold">{toCollect} USD</p>
            //   </div>

            //   <div className=" w-full  border-t border-gray-700 py-3 flex items-center justify-between">
            //     <button
            //       className=" p-3.5 px-4 uppercase font-bold bg-[#393C53] text-xs rounded-lg"
            //       onClick={() => setSelectedBets([])}
            //     >
            //       clear
            //     </button>
            //     <button
            //       className=" p-3.5 uppercase font-bold inner-shadow text-xs rounded-lg disabled:opacity-50"
            //       disabled={placingBet}
            //       onClick={placeBets}
            //     >
            //       {placingBet ? "Placing bet..." : "place pick"}
            //     </button>
            //   </div>
            // </div>
            <div
              className={` w-full md:w-[50%] sticky top-5 transition-all  border border-gray-200 p-4 rounded-xl bg-white  flex flex-col`}
            >
              <div className="flex items-start gap-4 mb-8 md:items-center justify-between md:mb-5  flex-col md:flex-row w-full">
                <h2 className="font-bold text-lg capitalize ">betting slip</h2>
                <div className="flex items-center border-gray-[#737897] rounded-lg bg-[#737897]/20">
                  <button
                    className={` ${
                      selectedBets.length === 1
                        ? "text-vintage-50"
                        : "text-primary-200"
                    } text-xs font-bold p-2p px-3   border-r border-gray-200`}
                  >
                    Single
                  </button>
                  <button
                    className={`text-xs font-bold p-2 px-3  ${
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
                  <p className="text-[#848BAC] text-sm 2xl:text-lg capitalize ">
                    No bets selected
                  </p>
                </div>
              )}

              {account && selectedBets.length === 1
                ? selectedBets.map((bet, index) => (
                    <>
                      <BetSlip
                        key={index}
                        bet={bet}
                        removeBet={removeBet}
                        onPickInputChange={onPickInputChange}
                      />
                    </>
                  ))
                : account &&
                  selectedBets.length > 1 && (
                    <>
                      <Parlay
                        selectedBets={selectedBets}
                        onPickInputChange={onParlayInputChange}
                        toWin={toCollect}
                        onRemove={() => setSelectedBets([])}
                      />
                    </>
                  )}
              <div className=" w-full  mt-3 border-t border-gray-200 py-3 flex items-center justify-between">
                <p className="text-sm  text-slate-500      ">Overall Odds</p>
                <p className="font-bold">{calculateOverallOdds()}</p>
              </div>
              <div className=" w-full mb-4  flex items-center - justify-between">
                <p className="text-sm  text-slate-500      ">To Collect</p>
                <p className="font-bold">{toCollect} USD</p>
              </div>

              <div className=" w-full  border-t border-gray-200 py-3 flex items-center justify-between">
                <button
                  className=" p-3.5 px-8 capitalize  font-bold  text-xs 2xl:text-sm rounded-full border-2 border-vintage-50"
                  onClick={() => setSelectedBets([])}
                >
                  clear
                </button>
                <button
                  className=" p-3.5 px-8 bg-vintage-50 text-white capitalize border-2  border-vintage-50  font-bold  text-xs 2xl:text-sm rounded-full disabled:opacity-50"
                  disabled={placingBet}
                  onClick={placeBets}
                >
                  {placingBet ? "Placing bet..." : "place pick"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default page;

const SkeletonLoader = () => {
  return (
    <div className="flex mt-4 items-center pb-3 max-w-full overflow-auto justify-evenly md:justify-start gap-2 mb-3">
      {[...Array(16)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-600 animate-pulse w-full min-w-32 md:w-fit flex-grow md:flex-grow-0 rounded-full px-4 py-2 h-10"
        ></div>
      ))}
    </div>
  );
};

const NewSportsTabs = ({
  sports,
  tab,
  changeTab,
  getNewSports,
}: {
  sports: any;
  tab?: number;
  changeTab: (sport: number) => void;
  getNewSports: (sportId: number) => void;
}) => {
  return (
    <div className="flex  bg-white items-center p-4 2xl:p-5 rounded-2xl max-w-full overflow-auto justify-evenly  gap-2 mb-3">
      {sports?.map((sport: any, index: number) => (
        <button
          key={index}
          className={`  
              px-8 text-xs w-68 2xl:text-base  py-3 flex   justify-center font-bold text-nowrap  items-center flex-grow md:flex-grow-0 rounded-full ${
                tab === sport.Id ? "bg-[#0100821A] border" : " "
              } uppercase`}
          onClick={() => {
            changeTab(sport.Id);
            getNewSports(sport.Id);
          }}
        >
          {sport.Name}
        </button>
      ))}
    </div>
  );
};

const NewLeaguesTabs = ({
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
        <DropdownMenuTrigger className="flex items-center justify-center p-3.5 px-5 gap-4 bg-white rounded-full ">
          <p className="text-xs 2xl:text-sm font-bold">
            {leagues.find((league: any) => league.Id === leagueTab)?.Name ||
              "Leagues"}
          </p>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-72 p-4 ml-8 rounded-lg overflow-y-auto">
          {leagues?.map((league: any, index: number) => (
            <DropdownMenuItem
              key={index}
              className={` 
                ${
                  leagueTab === league.Id
                    ? "bg-primary-200/30 text-vintage-50 "
                    : "text-vintage-50"
                }`}
              onClick={() => changeLeagueTab(league.Id)}
            >
              <p className="inline-flex items-center gap-2 text-base">
                {league.Name}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
