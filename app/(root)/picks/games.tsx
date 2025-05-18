"use client";
import { useGetGames } from "@/app/hooks/useGetGames";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import { americanToDecimalOdds, getOriginalAccountValue } from "@/lib/utils";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  bookmakers: any;
  setBookmakers: (bookmakers: any) => void;
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
  market: string;
  point?: number;
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
  bookmakers,
  setBookmakers,
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

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedBookmakers, setSelectedBookmakers] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    refetch();
    setLastUpdated(new Date());
    setCurrentPage(1); // Reset to first page when odds format changes
  }, [oddsFormat]);

  useEffect(() => {
    if (games && games.length > 0) {
      setFeaturedMatch(games[0]);
      // Initialize selected bookmakers for each game
      const initialBookmakers: Record<string, string> = {};
      games.forEach((game: any) => {
        if (game.bookmakers && game.bookmakers.length > 0) {
          initialBookmakers[game.id] = game.bookmakers[0].key;
        }
      });
      setSelectedBookmakers(initialBookmakers);
    }
  }, [games]);

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

  // PAGINATION LOGIC
  const totalPages = useMemo(() => {
    return filteredGames ? Math.ceil(filteredGames.length / gamesPerPage) : 0;
  }, [filteredGames]);

  const paginatedGames = useMemo(() => {
    if (!filteredGames) return [];
    const startIndex = (currentPage - 1) * gamesPerPage;
    return filteredGames.slice(startIndex, startIndex + gamesPerPage);
  }, [filteredGames, currentPage]);

  const getStartTime = (commenceTime: string) => {
    const date = new Date(commenceTime);
    return date.toLocaleString();
  };

  const handleSelectBet = (
    game: any,
    selection: string,
    odds: number,
    market: string,
    point?: number
  ) => {
    // Check if bet already exists
    if (bets.find((b) => b.id === game.id)) {
      toast.error("You have already added this game to your bet slip.");
      return;
    }

    const initialPick =
      getOriginalAccountValue(account) * ALL_STEP_CHALLENGES.minPickAmount;

    const bet: Bet = {
      id: game.id,
      team: selection,
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
      market: market,
      point: point,
    };

    addBet(bet);
  };

  const findTeamInBets = (team: string, id: number) => {
    return bets.find((bet) => bet.team === team && bet.id === id);
  };

  const handleBookmakerChange = (gameId: string, bookmakerKey: string) => {
    setSelectedBookmakers((prev) => ({
      ...prev,
      [gameId]: bookmakerKey,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full pb-12 flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!filteredGames) {
    return (
      <div className="w-full h-full pb-12 justify-center items-center font-bold text-center">
        <p>Failed to fetch games.</p>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="w-full h-full pb-12 justify-center items-center font-bold text-center">
        <p>No games found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4">
        {paginatedGames.map((game: any) => {
          const selectedBookmakerKey =
            selectedBookmakers[game.id] ||
            (game.bookmakers?.length > 0 ? game.bookmakers[0].key : null);

          const bookmaker =
            game.bookmakers?.find((b: any) => b.key === selectedBookmakerKey) ||
            game.bookmakers?.[0];

          const availableMarkets = bookmaker?.markets || [];
          const marketTypes = availableMarkets.map((m: any) => m.key);

          return (
            <div
              key={game.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {game.home_team} vs {game.away_team}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getStartTime(game.commence_time)} • {game.sport_title}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help">
                        {game.bookmakers?.length || 0} bookmakers
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data provided by The Odds API</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {game.bookmakers?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No odds available for this game
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.bookmakers?.map((bm: any) => (
                      <Badge
                        key={bm.key}
                        variant={
                          bm.key === selectedBookmakerKey
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleBookmakerChange(game.id, bm.key)}
                      >
                        {bm.title}
                      </Badge>
                    ))}
                  </div>

                  {availableMarkets.length > 0 && (
                    <Tabs defaultValue={marketTypes[0] || "h2h"}>
                      <TabsList className="mb-4">
                        {marketTypes.includes("h2h") && (
                          <TabsTrigger value="h2h">Moneyline</TabsTrigger>
                        )}
                        {marketTypes.includes("spreads") && (
                          <TabsTrigger value="spreads">Spread</TabsTrigger>
                        )}
                        {marketTypes.includes("totals") && (
                          <TabsTrigger value="totals">Total</TabsTrigger>
                        )}
                      </TabsList>

                      {marketTypes.includes("h2h") && (
                        <TabsContent value="h2h">
                          <div className="grid grid-cols-2 gap-4">
                            {bookmaker.markets
                              .find((m: any) => m.key === "h2h")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                    findTeamInBets(outcome.name, game.id)
                                      ? "bg-blue-50 border-blue-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "h2h"
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-2xl font-bold mt-2">
                                    {outcome.price}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {marketTypes.includes("spreads") && (
                        <TabsContent value="spreads">
                          <div className="grid grid-cols-2 gap-4">
                            {bookmaker.markets
                              .find((m: any) => m.key === "spreads")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                    findTeamInBets(outcome.name, game.id)
                                      ? "bg-blue-50 border-blue-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "spreads",
                                      outcome.point
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {outcome.point && outcome.point > 0
                                      ? "+"
                                      : ""}
                                    {outcome.point}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {outcome.price}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {marketTypes.includes("totals") && (
                        <TabsContent value="totals">
                          <div className="grid grid-cols-2 gap-4">
                            {bookmaker.markets
                              .find((m: any) => m.key === "totals")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                    findTeamInBets(outcome.name, game.id)
                                      ? "bg-blue-50 border-blue-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "totals",
                                      outcome.point
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {outcome.point}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {outcome.price}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
};

export default GamesTable;
