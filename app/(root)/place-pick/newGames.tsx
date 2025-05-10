"use client";
import { useGetGames } from "@/app/hooks/useGetGames";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import {
  americanToDecimalOdds,
  calculateToWin,
  getOriginalAccountValue,
} from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import Image from "next/image";
import toast from "react-hot-toast";
import { Bet } from "./page";

interface GetGamesParams {
  leagueTab: string;
  oddsFormat: "decimal" | "american";
  addBet: (bet: Bet) => void;
  bets: Bet[];
  setFeaturedMatch: (match: any) => void;
  account: any;
  tab: string;
  setBets: (bets: Bet[]) => void;
  search: string;
  setShowDetails: (show: boolean) => void;
  matchStatus: string;
  setDetailedMatchId: (id: number) => void;
}

const GamesTable = ({
  leagueTab,
  oddsFormat,
  addBet,
  bets,
  setBets,
  setFeaturedMatch,
  account,
  tab,
  search,
  setShowDetails,
  matchStatus,
  setDetailedMatchId,
}: GetGamesParams) => {
  const [gamesData, setGamesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sports/get-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sportsId: tab,
          tournamentId: Number(leagueTab),
          matchStatus: matchStatus === "live" ? 3 : 1,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to fetch games");
        throw new Error("Failed to fetch games");
      }

      const data = await res.json();
      console.log("🚀 ~ fetchGames ~ data:", data);
      setGamesData(data.matches);
    } catch (error) {
      console.log("🚀 ~ fetchGames ~ error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [oddsFormat, tab, leagueTab, matchStatus]);

  if (gamesData) {
    setFeaturedMatch(gamesData[0]);
  }

  const filteredGames = useMemo(() => {
    if (search !== "") {
      return gamesData?.filter(
        (game: any) =>
          game.Fixture.Participants[0].Name?.toLowerCase().includes(
            search.toLowerCase()
          ) ||
          game.Fixture.Participants[1].Name?.toLowerCase().includes(
            search.toLowerCase()
          )
      );
    }
    return gamesData;
  }, [search, isLoading, gamesData]);

  // PAGINATION
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  useEffect(() => {
    setPage(1);
  }, [filteredGames]);

  const goNext = () => {
    if (endIndex < filteredGames.length) {
      setPage(page + 1);
    }
  };
  const goPrev = () => {
    if (startIndex > 0) {
      setPage(page - 1);
    }
  };

  const paginatedGames = useMemo(() => {
    return filteredGames?.slice(startIndex, endIndex);
  }, [filteredGames, startIndex, endIndex]);

  //   BETS DATA
  const [oepnPickModal, setOpenPickModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [home, setHome] = useState(true);
  // const [pick, setPick] = useState(1);

  const openPickModal = ({ game, home }: { game: any; home: boolean }) => {
    // if bet id is already there, skip
    if (bets.find((b) => b.id === game.id)) {
      toast.error("You have already added this game to your bet slip.");
      return;
    }

    setSelectedTeam(home ? game.home_team : game.away_team);
    setHome(home);
    setSelectedGame(game);
    setOpenPickModal(true);
    return;
  };
  const onClose = () => {
    setOpenPickModal(false);
    setSelectedTeam(null);
    setSelectedGame(null);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center pb-16 pt-6  items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!filteredGames) {
    return (
      <div className="w-full h-full mb-12 p-4 px-12 bg-primary-200/20 rounded-md justify-center items-center font-bold text-center">
        <p>Failed to fetch games.</p>
      </div>
    );
  }

  if (!isLoading && filteredGames.length === 0) {
    return (
      <div className="w-full h-full pt-16 pb-24  justify-center items-center font-bold text-center">
        <p>
          No {matchStatus === "live" ? "Live" : "Upcoming"} Games Found. <br />
          <span className=" text-center text-sm ">
            Try searching for a different game or check back later for more
            games.
          </span>
        </p>{" "}
      </div>
      // <div className="w-full h-full mb-12 p-4 px-12 bg-primary-200/20 text-lg 2xl:text-xl rounded-md justify-center items-center font-bold text-center">
      //   <p>
      //     No {matchStatus === "live" ? "Live" : "Upcoming"} Games Found. <br />
      //     <span className=" text-center text-sm text-slate-200">
      //       Try searching for a different game or check back later for more
      //       games.
      //     </span>
      //   </p>
      // </div>
    );
  }

  return (
    <>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className=" bg-white text-[#848BAC] border-none">
          <TableRow className=" border-none">
            <TableHead className=" capitalize  font-bold text-center">
              Time
            </TableHead>
            <TableHead className=" capitalize font-bold text-center">
              Team & Odds
            </TableHead>
            <TableHead className=" capitalize font-bold text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" ">
          {paginatedGames.map((game: any) => {
            function convertUTCDateToLocalDate(date: Date): Date {
              const newDate = new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
              );
              return newDate;
            }

            const date = convertUTCDateToLocalDate(
              new Date(game.Fixture.StartDate)
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

            const timeString = new Intl.DateTimeFormat(
              "en-US",
              options1
            ).format(date);
            const dateString = new Intl.DateTimeFormat(
              "en-US",
              options2
            ).format(date);

            return (
              <TableRow key={game.FixtureId}>
                <TableCell className=" font-semibold w-[160px] capitalize text-xs py-5 border-b border-gray-300 2xl:text-base text-start truncate">
                  {
                    <span className="text-xs 2xl:text-base">
                      {timeString} - {dateString}
                    </span>
                  }
                </TableCell>

                <TableCell className=" w-full py-5 border-b border-gray-300 ">
                  <div
                    className={`flex w-full cursor-pointer items-center gap-2`}
                  >
                    <div
                      className={`  flex w-full 
                    justify-center  gap-5 px-4 p-3 text-sm  2xl:text-base
                     rounded-full bg-white`}
                    >
                      <p className="flex items-center font-semibold justify-center text-nowrap gap-2.5">
                        {game.Fixture.Participants[0].Name}
                      </p>
                    </div>
                    <p
                      className={`flex justify-center font-bold text-nowrap items-center gap-2 p-3 text-base font-serif   2xl:text-xl 
                      text-vintage-50  `}
                    >
                      vs
                    </p>
                    <div
                      className={`flex w-full cursor-pointer items-center gap-2`}
                    >
                      <div
                        className={`  flex w-full  justify-center
                    items-center gap-5 px-4 p-3 text-sm  2xl:text-base
                     rounded-full bg-white`}
                      >
                        <p className="flex items-center font-semibold text-nowrap gap-2.5">
                          {game.Fixture.Participants[1].Name}
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className=" w-full py-5 border-b border-gray-300 ">
                  <button
                    onClick={() => {
                      setShowDetails(true);
                      setDetailedMatchId(game.FixtureId);
                    }}
                    className=" bg-vintage-50 text-white font-semibold px-8 text-nowrap py-3 rounded-full"
                  >
                    Place Picks
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-5">
        <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base ">
          PAGE {page} OF {Math.ceil(filteredGames.length / pageSize)}
        </h4>
        <div className="flex gap-2 items-center">
          <button
            className={`text-2xl
            ${startIndex === 0 ? "text-[#848BAC]" : "text-black"}
            `}
            onClick={goPrev}
          >
            <TiArrowLeft />
          </button>
          <button
            className={`text-2xl
            ${
              page >= Math.ceil(filteredGames.length / pageSize)
                ? "text-[#848BAC]"
                : "text-black"
            }
            `}
            onClick={goNext}
          >
            <TiArrowRight />
          </button>
        </div>
      </div>
      {/* <Dialog open={oepnPickModal} onOpenChange={onClose}>
        <DialogContent className=" bg-primary-100 gap-1 p-5 text-white border-none">
          <form className="space-y-4" >
            <p>Bet on {selectedTeam}</p>
            <div>
              <label htmlFor="pick" className="text-sm">
                Bet
              </label>
              <Input
                id="pick"
                type="number"
                onChange={(e) => setPick(+e.target.value)}
                placeholder="Place your bet"
                className="bg-transparent text-white border border-white border-opacity-10"
              />
            </div>
            <button
              type="submit"
              className=" p-3.5 uppercase font-bold inner-shadow text-xs rounded-lg"
            >
              PLACE bet
            </button>
          </form>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default GamesTable;
