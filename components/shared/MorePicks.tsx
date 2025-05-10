import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";
import { americanToDecimalOdds, getOriginalAccountValue } from "@/lib/utils";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import { Bet } from "@/app/(root)/place-pick/page";
type oddsType = "american" | "decimal";

const MorePicks = ({
  setShowDetails,
  matchId,
  sportsId,
  leagueId,
  bets,
  setBets,
  addBet,
  account,
  leagueTab,
  tab,
  sportName,
}: {
  setShowDetails: (show: boolean) => void;
  matchId: number;
  sportsId: number;
  leagueId: string;
  bets: Bet[];
  addBet: (bet: Bet) => void;
  account: any;
  setBets: (bets: Bet[]) => void;
  leagueTab: string;
  tab: number;
  sportName: string;
}) => {
  const [matchDetails, setMatchDetails] = useState<any>(null);
  console.log("🚀 ~ matchDetails:", matchDetails);
  const [markets, setMarkets] = useState<any>([]);
  console.log("🚀 ~ markets:", markets);
  const [oddsFormat, setOddsFormat] = useState<oddsType>("decimal");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(""); // State to track the search text

  const getDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sports/get-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sportsId,
          leagueId,
          matchId,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to fetch game details");
        throw new Error("Failed to fetch games");
      }

      const data = await res.json();
      setMatchDetails(data.match[0]);
    } catch (error) {
      console.log("🚀 ~ fetchGames ~ error", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getMarkets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sports/get-markets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sportsId,
          leagueId,
          matchId,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to fetch Markets");
        throw new Error("Failed to fetch Markets");
      }

      const data = await res.json();
      console.log("🚀 ~ fetchMarkets ~ data:", data);
      // setMatchDetails(data.match[0]);
      setMarkets(data.markets[0].Markets);
    } catch (error) {
      console.log("🚀 ~ fetchMarkets ~ error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (matchId && sportsId && leagueId) {
      getDetails();
      getMarkets();
    }
  }, [matchId, sportsId, leagueId]);

  const addGameToBetSlip = ({
    market,
    team,
    marketName,
    betId,
  }: {
    market: any;
    team: string;
    marketName: string;
    betId: number;
  }) => {
    let gameAlreadyInBetSlip = false;
    bets.forEach((bet) => {
      if (
        bet.id === betId &&
        bet.marketId === market.Id &&
        bet.bet === marketName
      ) {
        gameAlreadyInBetSlip = true;
      }
    });

    // if game exists, remove it
    if (gameAlreadyInBetSlip) {
      console.log("game already in betslip");
      // setBets(
      //   bets.filter(
      //     (bet) =>
      //       bet.id !== betId &&
      //       bet.marketId !== market.Id &&
      //       bet.market !== marketName
      //   )
      // );
      setBets(
        bets.filter(
          (bet) =>
            !(
              bet.id === betId &&
              bet.marketId === market.Id &&
              bet.bet === marketName
            )
        )
      );
    }

    const odds =
      oddsFormat === "decimal"
        ? market.Bets.find((bet: any) => bet.Name === marketName)?.Price
        : market.Bets.find((bet: any) => bet.Name === marketName)?.PriceUS;
    const initialPick =
      getOriginalAccountValue(account) * ALL_STEP_CHALLENGES.minPickAmount;
    const bet: Bet = {
      id: betId,
      matchId: matchDetails.FixtureId,
      marketId: market.Id,
      market: market.Name,
      bet: marketName,
      team:
        team === "home"
          ? matchDetails.Fixture.Participants[0].Name
          : team === "away"
          ? matchDetails.Fixture.Participants[1].Name
          : "Draw",

      odds: Number(odds),
      pick: initialPick,
      toWin:
        oddsFormat === "decimal"
          ? initialPick * (Number(odds) - 1)
          : initialPick * (americanToDecimalOdds(Number(odds)) - 1),
      oddsFormat: oddsFormat,
      home_team: matchDetails.Fixture.Participants[0].Name,
      away_team: matchDetails.Fixture.Participants[1].Name,
      gameDate: matchDetails.Fixture.StartDate,
      sport: sportName,
      league: leagueTab.toString(),
      event: `${matchDetails.Fixture.Participants[0].Name} vs ${matchDetails.Fixture.Participants[1].Name}`,
    };

    // if bet id is already there, skip
    if (
      bets.find(
        (b) =>
          b.matchId === bet.matchId &&
          b.market === bet.market &&
          b.marketId === bet.marketId
      )
    ) {
      console.log("bet already in betslip");
      return;
    }

    addBet(bet);
  };

  const findMarketInBets = (id: number, name: string, betId: number) => {
    return bets.find(
      (bet) => bet.marketId === id && bet.bet === name && bet.id === betId
    );
  };

  const changeOddsFormat = (format: oddsType) => {
    setOddsFormat(format);
  };

  if (isLoading || !matchDetails || !markets) {
    return (
      <div className="w-full h-full mb-12 flex items-center justify-center p-16 animate-pulse px-12 bg-primary-200/20 text-lg 2xl:text-xl rounded-md  font-bold text-center">
        <Loader2 className="w-10 h-10 text-primary-50 animate-spin" />
      </div>
    );
  }

  // Handle search input change
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  // Filter the markets based on the search input
  const filteredMarkets = markets.filter((market: any) => {
    return market.Name.toLowerCase().includes(search.toLowerCase());
  });

  // function convertUTCDateToLocalDate(date: Date): Date {
  //   const newDate = new Date(
  //     date.getTime() + date.getTimezoneOffset() * 60 * 1000
  //   );
  //   const offset = date.getTimezoneOffset() / 60;
  //   const hours = date.getHours();
  //   newDate.setHours(hours - offset);
  //   return newDate;
  // }

  // const date = convertUTCDateToLocalDate(
  //   new Date(matchDetails.Fixture.StartDate)
  // );

  // const options1: Intl.DateTimeFormatOptions = {
  //   weekday: "long",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: true,
  // };
  // const options2: Intl.DateTimeFormatOptions = {
  //   month: "long",
  //   day: "numeric",
  //   year: "numeric",
  // };

  // const timeString = new Intl.DateTimeFormat("en-US", options1).format(date);
  // const dateString = new Intl.DateTimeFormat("en-US", options2).format(date);

  // console.log(`${timeString}\n${dateString}`);

  function convertUTCDateToLocalDate(date: Date): Date {
    const newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  const date = convertUTCDateToLocalDate(
    new Date(matchDetails.Fixture.StartDate)
  );

  const options1: Intl.DateTimeFormatOptions = {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const options2: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const timeString = new Intl.DateTimeFormat("en-US", options1).format(date);
  const dateString = new Intl.DateTimeFormat("en-US", options2).format(date);

  console.log(`${timeString}\n${dateString}`);

  return (
    <div className=" w-full space-y-5">
      <div
        className=" w-full h-80 rounded-xl relative flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url('/matchBg.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <button
          onClick={() => setShowDetails(false)}
          className=" absolute left-5 top-5 bg-primary rounded-full "
        >
          <ChevronLeft className="w-8 h-8 text-white  " />
        </button>

        <h2 className=" bg-vintage-50 px-12 mb-7 py-2 text-xl text-white  rounded-full border border-[#FFFFFF1A]">
          {matchDetails.Fixture.League.Name}
        </h2>
        <div className=" w-full  justify-center px-4 flex items-center gap-32">
          <div className=" space-y-2 flex w-full flex-col items-center justify-center">
            <h2 className="text-2xl text-center text-white uppercase font-bold tracking-wide">
              {matchDetails.Fixture.Participants[0].Name}
            </h2>
          </div>
          <div className="flex text-2xl px-4 text-center w-full text-white font-semibold flex-col items-center justify-center gap-2">
            {matchDetails.Fixture.Status === 2 ? (
              <>
                <Image
                  src="/live.svg"
                  alt="live"
                  width={160}
                  className=" animate-pulse"
                  height={160}
                />{" "}
              </>
            ) : (
              <>
                <p className="text-center">
                  <span className="text-lg">
                    {timeString} <br />
                  </span>
                  {dateString}
                </p>
              </>
            )}
          </div>
          <div className=" space-y-2 w-full px-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl text-center uppercase text-white  font-bold tracking-wide">
              {matchDetails.Fixture.Participants[1].Name}
            </h2>
          </div>
        </div>
      </div>
      <div className=" w-full transition-all  rounded-xl bg-white pb-8 p-4 md:p-6 md:pb-12 2xl:px-10  flex flex-col">
        <div className="flex items-center justify-between  border-b pb-4 my-6 border-vintage-50/20  w-full gap-4">
          <h2 className="text-2xl md:text-3xl 2xl:text-4xl text-vintage-50  font-semibold">
            Main Market
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="  bg-vintage-50  font-bold   justify-center w-[95%] text-sm 2xl:text-base md:w-fit  p-3.5 px-6 text-white md:mr-3  rounded-full inline-flex items-center gap-2 uppercase">
              <span className=" capitalize">Odds:</span>
              {oddsFormat}
              <FaAngleDown className=" text-lg ml-0.5 mb-0.5 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48  bg-white text-vintage-50  border-none  mt-1  p-3 rounded-lg text-sm 2xl:text-base">
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => changeOddsFormat("decimal")}
              >
                <p> Decimal</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center justify-between "
                onClick={() => changeOddsFormat("american")}
              >
                <p>American</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>{" "}
        </div>
        {markets.length === 0 ? (
          <div className="text-center text-vintage-50 py-4  text-lg font-semibold">
            No markets found
          </div>
        ) : (
          <div
            className={`grid grid-cols-5 w-full mb-8 cursor-pointer items-center gap-4`}
          >
            {markets.length &&
              markets[0].Bets.find((bet: any) => bet.Name === "1") && (
                <div
                  onClick={() =>
                    addGameToBetSlip({
                      market: markets[0],
                      team: "home",
                      marketName: markets[0].Bets.find(
                        (bet: any) => bet.Name === "1"
                      ).Name,
                      betId: markets[0].Bets.find(
                        (bet: any) => bet.Name === "1"
                      ).Id,
                    })
                  }
                  className={`
                 ${
                   findMarketInBets(
                     markets[0].Id,
                     markets[0].Bets.find((bet: any) => bet.Name === "1").Name,
                     markets[0].Bets.find((bet: any) => bet.Name === "1").Id
                   ) && "border-4 border-green-400"
                 }
                col-span-2
                flex w-full justify-center flex-col items-center px-3.5 md:px-6 py-8 text-sm 2xl:text-base text-white bg-vintage-50  rounded-lg`}
                >
                  <div className="flex flex-col justify-center items-center text-nowrap gap-3">
                    <p className="text-4 2xl:text-5xl font-bold">
                      {
                        // Find the Home Team bet and get its Price
                        oddsFormat === "decimal"
                          ? Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "1"
                              )?.Price
                            ).toFixed(2)
                          : Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "1"
                              )?.PriceUS
                            ).toFixed(0)
                      }
                    </p>
                    <p className="font-semibold tracking-wide px-8 py-2 mt-2 text-vintage-50 bg-white rounded-full">
                      Home Team
                    </p>
                  </div>
                </div>
              )}

            {markets.length &&
              markets[0].Bets.find((bet: any) => bet.Name === "X") && (
                <div
                  onClick={() =>
                    addGameToBetSlip({
                      market: markets[0],
                      team: "draw",
                      marketName: markets[0].Bets.find(
                        (bet: any) => bet.Name === "X"
                      ).Name,
                      betId: markets[0].Bets.find(
                        (bet: any) => bet.Name === "X"
                      ).Id,
                    })
                  }
                  className={`
                 ${
                   findMarketInBets(
                     markets[0].Id,
                     markets[0].Bets.find((bet: any) => bet.Name === "X").Name,
                     markets[0].Bets.find((bet: any) => bet.Name === "X").Id
                   ) && "border-4 border-green-400"
                 }
                col-span-1 flex w-full justify-center flex-col items-center px-3.5 md:px-6 py-8 text-sm 2xl:text-base text-white bg-vintage-50  rounded-lg`}
                >
                  <div className="flex flex-col justify-center items-center text-nowrap gap-3">
                    <p className="text-4 2xl:text-5xl font-bold">
                      {
                        // Find the Draw bet and get its Price
                        oddsFormat === "decimal"
                          ? Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "X"
                              )?.Price
                            ).toFixed(2)
                          : Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "X"
                              )?.PriceUS
                            ).toFixed(0)
                      }
                    </p>
                    <p className="font-semibold tracking-wide px-8 py-2 mt-2 text-vintage-50 bg-white rounded-full">
                      Draw
                    </p>
                  </div>
                </div>
              )}

            {markets.length &&
              markets[0].Bets.find((bet: any) => bet.Name === "2") && (
                <div
                  onClick={() =>
                    addGameToBetSlip({
                      market: markets[0],
                      team: "away",
                      marketName: markets[0].Bets.find(
                        (bet: any) => bet.Name === "2"
                      ).Name,
                      betId: markets[0].Bets.find(
                        (bet: any) => bet.Name === "2"
                      ).Id,
                    })
                  }
                  className={`
                 ${
                   findMarketInBets(
                     markets[0].Id,
                     markets[0].Bets.find((bet: any) => bet.Name === "2").Name,

                     markets[0].Bets.find((bet: any) => bet.Name === "2").Id
                   ) && "border-4 border-green-400"
                 }
                col-span-2 flex w-full justify-center flex-col items-center px-3.5 md:px-6 py-8 text-sm 2xl:text-base text-white bg-vintage-50  rounded-lg`}
                >
                  <div className="flex flex-col justify-center items-center text-nowrap gap-3">
                    <p className="text-4 2xl:text-5xl font-bold">
                      {
                        // Find the Away Team bet and get its Price
                        oddsFormat === "decimal"
                          ? Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "2"
                              )?.Price
                            ).toFixed(2)
                          : Number(
                              markets[0]?.Bets.find(
                                (bet: any) => bet.Name === "2"
                              )?.PriceUS
                            ).toFixed(0)
                      }
                    </p>
                    <p className="font-semibold tracking-wide px-8 py-2 mt-2 text-vintage-50 bg-white rounded-full">
                      Away Team
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}

        <h2 className="text-2xl md:text-3xl 2xl:text-4xl text-vintage-50  font-semibold border-b pb-4 my-6 border-vintage-50/20  w-full">
          Other Markets
        </h2>
        <div className=" border-2 border-vintage-50/40 inline-flex w-full items-center py-2 px-4 md:px-6 rounded-full">
          <LuSearch className="w-7 h-7 text-vintage-50" />
          <Input
            className="bg-transparent text-vintage-50 focus:outline-0 focus:ring-0 focus:border-none placeholder-slate-900 uppercase"
            placeholder={"search..."}
            value={search}
            onChange={handleSearch} // Update the search state when user types
          />
        </div>
        <div className="my-4 space-y-3">
          <Accordion
            type="single"
            collapsible
            className="  border-none  space-y-3"
          >
            {filteredMarkets.map((market: any, index: number) => {
              if (market.Name === "1X2") return null;
              return (
                <AccordionItem
                  value={`${index}`}
                  className="bg-vintage-50 rounded-lg text-white"
                >
                  <AccordionTrigger className="  border-none   text-nowrap w-full  text-sm md:text-base 2xl:text-lg px-3.5 md:px-6 py-4 font-semibold rounded-lg inline-flex items-center justify-between gap-2">
                    {market.Name}
                  </AccordionTrigger>
                  <AccordionContent className=" px-4">
                    <div
                      className={` w-full cursor-pointer gap-2`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${market.Bets.length}, 1fr)`, // Create as many columns as the length of the Bets array
                      }}
                    >
                      {market.Bets.map((bet: any, index: number) => {
                        return (
                          <div
                            onClick={() =>
                              addGameToBetSlip({
                                market: market,
                                team: "draw",
                                marketName: market.Bets[index].Name,
                                betId: market.Bets[index].Id,
                              })
                            }
                            className={`  
                              ${
                                findMarketInBets(
                                  market.Id,
                                  market.Bets[index].Name,
                                  market.Bets[index].Id
                                ) && "border-4 border-green-400"
                              }
                              
                              flex w-full  justify-between 
                    items-center  px-3.5 md:px-6 py-4 text-sm  2xl:text-base  bg-white
                    text-vintage-50 rounded-lg`}
                          >
                            <p className="font-semibold tracking-wide  ">
                              {bet.Name === "1"
                                ? matchDetails.Fixture.Participants[0].Name
                                : bet.Name === "2"
                                ? matchDetails.Fixture.Participants[1].Name
                                : bet.Name === "X"
                                ? "Draw"
                                : bet.Name}
                            </p>
                            <p className="text-xl font-bold">
                              {oddsFormat === "decimal"
                                ? Number(bet.Price).toFixed(2)
                                : Number(bet.PriceUS).toFixed(0)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            {
              // If there are no markets, display a message
              filteredMarkets.length === 0 && (
                <div className="text-center text-vintage-50 pt-6 pb-2  text-lg font-semibold">
                  No markets found
                </div>
              )
            }
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default MorePicks;
