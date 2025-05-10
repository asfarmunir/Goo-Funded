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
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";

interface GetGamesParams {
  sportKey: string;
  oddsFormat: "decimal" | "american";
  addBet: (bet: Bet) => void;
  bets: Bet[];
  setFeaturedMatch: (match: any) => void;
  account: any;
  tab: string;
  setBets: (bets: Bet[]) => void;
  search: string;
}

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
}

const GamesTable = ({
  sportKey,
  oddsFormat,
  addBet,
  bets,
  setBets,
  setFeaturedMatch,
  account,
  tab,
  search,
}: GetGamesParams) => {
  // GAMES DATA
  const {
    data: games,
    isLoading,
    refetch,
  } = useGetGames({
    sportKey: sportKey,
    oddsFormat: oddsFormat,
  });

  useEffect(() => {
    refetch();
  }, [oddsFormat]);

  if (games) {
    console.log(games[0]);
    setFeaturedMatch(games[0]);
  }

  // SEARCH FILTER
  const filteredGames = useMemo(() => {
    if (!isLoading && search !== "") {
      return games?.filter(
        (game: any) =>
          game.home_team?.toLowerCase().includes(search.toLowerCase()) ||
          game.away_team?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return games;
  }, [search, isLoading, games]);
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

  const addGameToBetSlip = ({ game, home }: { game: any; home: boolean }) => {
    // e.preventDefault();
    let gameAlreadyInBetSlip = false;
    bets.forEach((bet) => {
      if (bet.id === game.id) {
        gameAlreadyInBetSlip = true;
      }
    });

    // if game exists, remove it
    if (gameAlreadyInBetSlip) {
      setBets(bets.filter((bet) => bet.id !== game.id));
    }

    const odds = home
      ? getTeamOdds(game.bookmakers[0]?.markets[0]?.outcomes, game.home_team)
      : getTeamOdds(game.bookmakers[0]?.markets[0]?.outcomes, game.away_team);
    const initialPick =
      getOriginalAccountValue(account) * ALL_STEP_CHALLENGES.minPickAmount;

    const bet: Bet = {
      id: game.id,
      team: home ? game.home_team : game.away_team,
      odds: Number(odds),
      pick: initialPick,
      toWin:
        oddsFormat === "decimal"
          ? initialPick * (Number(odds) - 1)
          : initialPick * (americanToDecimalOdds(Number(odds)) - 1),
      oddsFormat: oddsFormat,
      home_team: game.home_team,
      away_team: game.away_team,
      gameDate: game.commence_time,
      sport: tab,
      league: sportKey,
      event: `${game.home_team} vs ${game.away_team}`,
    };

    // if bet id is already there, skip
    if (bets.find((b) => b.id === bet.id)) {
      return;
    }

    addBet(bet);
    onClose();
  };

  const findTeamInBets = (team: string, id: number) => {
    return bets.find((bet) => bet.team === team && bet.id === id);
  };

  const getTeamOdds = (outcomes: any, team: string) => {
    return outcomes?.find((outcome: any) => outcome.name === team)?.price;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoaderCircle />
      </div>
    );
  }

  if (!filteredGames) {
    return (
      <div className="w-full h-full justify-center items-center font-bold text-center">
        <p>Failed to fetch games.</p>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="w-full h-full justify-center items-center font-bold text-center">
        <p>No games found.</p>
      </div>
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
          </TableRow>
        </TableHeader>
        <TableBody className=" ">
          {paginatedGames.map((game: any) => (
            <TableRow key={game.id}>
              <TableCell className=" font-semibold w-[160px] capitalize text-xs py-5 border-b border-gray-300 2xl:text-base text-start truncate">
                {new Date(game.commence_time).toUTCString()}{" "}
              </TableCell>

              <TableCell className=" w-full py-5 border-b border-gray-300 ">
                <div
                  className={`flex w-full cursor-pointer items-center gap-2`}
                >
                  <div
                    onClick={() => addGameToBetSlip({ game, home: true })}
                    className={`  ${
                      findTeamInBets(game.home_team, game.id)
                        ? "  bg-[#0100821A] text-vintage-50 font-semibold "
                        : "bg-white"
                    }  flex w-full text-start justify-between
                    items-center gap-5 px-4 p-3 text-sm  2xl:text-base
                     rounded-full`}
                  >
                    <p className="flex items-center text-nowrap gap-1">
                      {game.home_team}
                    </p>
                    <span className=" ">
                      {getTeamOdds(
                        game.bookmakers[0]?.markets[0]?.outcomes,
                        game.home_team
                      )}{" "}
                    </span>
                  </div>
                  <p
                    className={`flex justify-center font-bold text-nowrap items-center gap-2 p-3 text-base font-serif   2xl:text-xl 
                      text-vintage-50  `}
                  >
                    vs
                  </p>
                  <div
                    onClick={() => addGameToBetSlip({ game, home: false })}
                    className={`${
                      findTeamInBets(game.away_team, game.id)
                        ? "  bg-[#0100821A] text-vintage-50 font-semibold "
                        : "bg-white"
                    }  flex w-full text-start justify-between
                    items-center gap-5 px-4 p-3 text-sm  2xl:text-base
                     rounded-full`}
                  >
                    <p className="flex items-center text-nowrap gap-1">
                      {game.away_team}
                    </p>

                    <span className=" ">
                      {getTeamOdds(
                        game.bookmakers[0]?.markets[0]?.outcomes,
                        game.away_team
                      )}{" "}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between p-5">
        <h4 className="text-[#848BAC] font-thin text-xs 2xl:text-base ">
          PAGE {page} OF {Math.ceil(filteredGames.length / pageSize)}
        </h4>
        <div className="flex gap-2 items-center">
          <button
            className={`text-2xl
            ${startIndex === 0 ? "text-[#848BAC]" : "text-vintage-50"}
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
                : "text-vintage-50"
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
              className=" p-3.5  capitalize font-bold inner-shadow text-xs rounded-lg"
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
