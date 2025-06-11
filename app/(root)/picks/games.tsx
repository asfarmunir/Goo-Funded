"use client";
import { ALL_STEP_CHALLENGES } from "@/lib/constants";
import { americanToDecimalOdds, getOriginalAccountValue } from "@/lib/utils";
import {
  LoaderCircle,
  Info,
  ChevronRight,
  Zap,
  Trophy,
  Clock,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { getLiveScores } from "@/app/mutations/get-live-scores";
import { useGetGames } from "@/app/hooks/useGetGames";
import debounce from "lodash/debounce";
import { getEventOdds } from "@/app/mutations/get-event-odd";

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
  id: string;
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
  live?: boolean;
  homeScore?: string;
  awayScore?: string;
  period?: string;
  clock?: string;
  betDetails: {
    market: string;
    point: number | null;
    description?: string;
    bookmaker: string;
  };
}

const marketLabels: Record<string, string> = {
  h2h: "Moneyline",
  spreads: "Spread",
  totals: "Total",
  btts: "Both Teams to Score",
  draw_no_bet: "Draw No Bet",
  h2h_3_way: "3-Way Moneyline",
  team_totals: "Team Totals",
  alternate_team_totals: "Alternate Team Totals",
  h2h_q1: "1st Quarter Moneyline",
  player_assists: "Player Assists",
};

const GamesTable = ({
  sportKey,
  oddsFormat,
  addBet,
  bets,
  setFeaturedMatch,
  account,
  tab,
  search,
  bookmakers,
  setBookmakers,
}: GetGamesParams) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedBookmakers, setSelectedBookmakers] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openDrawerGameId, setOpenDrawerGameId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<"upcoming" | "live">("upcoming");
  const [isModeTransitioning, setIsModeTransitioning] = useState(false);
  const [showSoonGames, setShowSoonGames] = useState(false);
  const gamesPerPage = 10;

  // Debounce mode switching
  const debouncedSetActiveMode = useCallback(
    debounce((mode: "upcoming" | "live") => {
      setActiveMode(mode);
      setIsModeTransitioning(true);
      setShowSoonGames(false); // Reset soon games filter when switching modes
    }, 300),
    []
  );

  // Fetch live scores when in live mode
  const { data: liveScores, isLoading: isLiveScoresLoading } = useQuery({
    queryKey: ["liveScores", sportKey],
    queryFn: () => getLiveScores({ sportKey }),
    enabled: activeMode === "live",
    refetchInterval: 30000, // Poll every 30 seconds
    keepPreviousData: true, // Retain previous data during refetch
  });

  // Fetch all games (upcoming and live)
  const {
    data: games,
    isLoading: isGamesLoading,
    refetch,
  } = useGetGames({
    sportKey,
    oddsFormat,
  });

  // Fetch additional markets for drawer
  const { data: eventOdds, isLoading: isEventOddsLoading } = useQuery({
    queryKey: ["eventOdds", openDrawerGameId, sportKey, oddsFormat],
    queryFn: () =>
      getEventOdds({ sportKey, eventId: openDrawerGameId!, oddsFormat }),
    enabled: !!openDrawerGameId,
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  // Synchronize refetch on mode or odds format change
  useEffect(() => {
    refetch().finally(() => setIsModeTransitioning(false));
    setLastUpdated(new Date());
    setCurrentPage(1);
  }, [oddsFormat, activeMode, liveScores, refetch, sportKey]);

  // Set initial bookmakers and featured match
  useEffect(() => {
    if (games && games.length > 0) {
      setFeaturedMatch(games[0]);
      const initialBookmakers: Record<string, string> = {};
      games.forEach((game: any) => {
        if (game.bookmakers && game.bookmakers.length > 0) {
          initialBookmakers[game.id] = game.bookmakers[0].key;
        }
      });
      setSelectedBookmakers(initialBookmakers);
    }
  }, [games, setFeaturedMatch]);

  const filteredGames = useMemo(() => {
    if (
      isGamesLoading ||
      (activeMode === "live" && isLiveScoresLoading) ||
      isModeTransitioning
    ) {
      return [];
    }

    let processedGames = games || [];

    if (activeMode === "live" && liveScores) {
      // Match live games from liveScores with odds from games
      processedGames = liveScores
        .filter((scoreGame: any) => !scoreGame.completed) // Exclude completed games
        .map((scoreGame: any) => {
          const oddsGame = games?.find((g: any) => g.id === scoreGame.id);
          if (!oddsGame) return null;

          const homeScore =
            scoreGame.scores?.find((s: any) => s.name === scoreGame.home_team)
              ?.score || "0";
          const awayScore =
            scoreGame.scores?.find((s: any) => s.name === scoreGame.away_team)
              ?.score || "0";

          return {
            ...oddsGame,
            homeScore,
            awayScore,
            period: scoreGame.scoreboard?.display_period,
            clock: scoreGame.scoreboard?.display_clock,
            isLive: true,
          };
        })
        .filter((game: any) => game !== null);
    } else {
      // For upcoming mode, filter out completed games
      processedGames = processedGames.filter((game: any) => !game.completed);

      // Filter for games within the next 3 hours if showSoonGames is true
      if (showSoonGames) {
        const now = new Date();
        const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        processedGames = processedGames.filter((game: any) => {
          const gameTime = new Date(game.commence_time);
          return gameTime >= now && gameTime <= threeHoursFromNow;
        });
      }
    }

    if (search !== "") {
      processedGames = processedGames.filter(
        (game: any) =>
          game.home_team?.toLowerCase().includes(search.toLowerCase()) ||
          game.away_team?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return processedGames;
  }, [
    search,
    isGamesLoading,
    isLiveScoresLoading,
    isModeTransitioning,
    games,
    liveScores,
    activeMode,
    showSoonGames,
  ]);

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
    return date.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatOdds = (odds: number) => {
    if (oddsFormat === "american") {
      return odds >= 2 ? `+${odds}` : odds;
    }
    return odds.toFixed(2);
  };

  const handleSelectBet = (
    game: any,
    selection: string,
    odds: number,
    market: string,
    point: number | undefined,
    description: string | undefined,
    bookmakerKey: string
  ) => {
    const conflictingBet = bets.find(
      (b) =>
        b.id === game.id &&
        b.betDetails.market === market &&
        b.team !== selection &&
        b.betDetails.description === description
    );
    if (conflictingBet) {
      toast.error(
        `Cannot add ${selection} (${marketLabels[market]}) as it conflicts with an existing ${conflictingBet.team} (${marketLabels[market]}) bet for this game.`
      );
      return;
    }

    const existingBet = bets.find(
      (b) =>
        b.id === game.id &&
        b.betDetails.market === market &&
        b.team === selection &&
        b.betDetails.description === description &&
        b.betDetails.bookmaker === bookmakerKey
    );
    if (existingBet) {
      toast.error("This bet is already in your bet slip.");
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
      live: game.isLive,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      period: game.period,
      clock: game.clock,
      betDetails: {
        market,
        point: point ?? null,
        description,
        bookmaker: bookmakerKey,
      },
    };

    addBet(bet);
    setBookmakers((prev: any) => [
      ...prev,
      { eventId: game.id, bookmakerName: bookmakerKey },
    ]);
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

  const toggleSoonGames = () => {
    setShowSoonGames((prev) => !prev);
    setCurrentPage(1); // Reset to first page when toggling
    refetch();
  };

  if (
    isGamesLoading ||
    (activeMode === "live" && isLiveScoresLoading) ||
    isModeTransitioning
  ) {
    return (
      <div className="w-full h-full pb-12 flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
        {isModeTransitioning && (
          <p className="ml-4 text-[#848BAC]">Switching modes...</p>
        )}
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
      <div className="w-full h-full pb-12 flex gap-3 flex-col justify-center items-center font-bold text-center">
        <p>
          No{" "}
          {activeMode === "live"
            ? "live"
            : showSoonGames
              ? "soon upcoming"
              : "upcoming"}{" "}
          games found.
        </p>
        <div className="flex items-center gap-4 flex-col md:flex-row">
          {activeMode === "upcoming" && (
            <Button
              onClick={toggleSoonGames}
              className="flex items-center gap-1 py-2.5 shadow-sm hover:bg-slate-50 rounded-full bg-white text-vintage-50 font-bold"
            >
              <Clock className="h-4 w-4" />
              {showSoonGames ? "Show All Games" : "Show Games Within 3 Hours"}
            </Button>
          )}
          <button
            onClick={() =>
              debouncedSetActiveMode(
                activeMode === "upcoming" ? "live" : "upcoming"
              )
            }
            className="p-2.5 px-4 md:px-6 text-xs uppercase bg-vintage-50 text-white font-bold rounded-full flex items-center gap-2"
          >
            {activeMode !== "live" && <Zap className="text-sm" />}
            {activeMode !== "upcoming" && (
              <Trophy className="text-xs" size={18} />
            )}
            <span className="hidden md:inline">
              {activeMode !== "live" ? "Live Betting" : "Upcoming Games"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {lastUpdated && (
            <p className="text-sm text-[#848BAC]">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeMode === "upcoming" && (
            <Button
              onClick={toggleSoonGames}
              className="flex items-center gap-1 py-2.5 hover:bg-slate-50 shadow-sm rounded-full bg-white text-vintage-50 font-bold"
            >
              <Clock className="h-4 w-4" />
              {showSoonGames ? "Show All Games" : "Show Games Within 3 Hours"}
            </Button>
          )}
          <button
            onClick={() =>
              debouncedSetActiveMode(
                activeMode === "upcoming" ? "live" : "upcoming"
              )
            }
            className="p-2.5 px-4 md:px-6 text-xs uppercase bg-vintage-50 text-white font-bold rounded-full flex items-center gap-2"
          >
            {activeMode !== "live" && <Zap className="text-sm" />}
            {activeMode !== "upcoming" && (
              <Trophy className="text-xs" size={18} />
            )}
            <span className="hidden md:inline">
              {activeMode !== "live" ? "Live Betting" : "Upcoming Games"}
            </span>
          </button>
        </div>
      </div>
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
              className={`border rounded-lg p-4 bg-white shadow-sm ${
                game.isLive ? "border-l-4 border-l-vintage-50" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-vintage-50">
                      {game.home_team} vs {game.away_team}
                    </h3>
                    {game.isLive && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="animate-pulse bg-red-600 text-white uppercase "
                        >
                          Live
                        </Badge>
                        {game.period && (
                          <Badge variant="outline">{game.period}</Badge>
                        )}
                        {game.clock && (
                          <Badge variant="outline">{game.clock}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#848BAC]">
                    {game.isLive
                      ? `${game.homeScore} - ${game.awayScore}`
                      : getStartTime(game.commence_time)}{" "}
                    • {game.sport_title}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help">
                        <Info className="h-3 w-3 mr-1" />
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
                <p className="text-[#848BAC] text-center py-4">
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
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center rounded-full text-white gap-1 bg-vintage-50 hover:bg-gray-100"
                          onClick={() => setOpenDrawerGameId(game.id)}
                        >
                          Show More Markets <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="bg-white rounded-t-lg">
                        <DrawerHeader>
                          <DrawerTitle className="text-vintage-50 text-lg font-bold">
                            {game.home_team} vs {game.away_team}
                          </DrawerTitle>
                          <p className="text-sm text-[#848BAC]">
                            {game.isLive
                              ? `${game.homeScore} - ${game.awayScore}`
                              : getStartTime(game.commence_time)}{" "}
                            • {game.sport_title}
                          </p>
                          {game.isLive && (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="animate-pulse"
                              >
                                Live
                              </Badge>
                              {game.period && (
                                <Badge variant="outline">{game.period}</Badge>
                              )}
                              {game.clock && (
                                <Badge variant="outline">{game.clock}</Badge>
                              )}
                            </div>
                          )}
                        </DrawerHeader>
                        {isEventOddsLoading ? (
                          <div className="text-center py-12">
                            <LoaderCircle className="animate-spin text-[#848BAC]" />
                            <p className="text-[#848BAC]">Loading markets...</p>
                          </div>
                        ) : !eventOdds || eventOdds.id !== game.id ? (
                          <p className="text-center py-4 text-[#848BAC]">
                            No additional markets available
                          </p>
                        ) : (
                          <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
                            {eventOdds.bookmakers.map((bm: any) => (
                              <div key={bm.key} className="mb-6">
                                <h4 className="font-semibold text-vintage-50 mb-2">
                                  {bm.title}
                                </h4>
                                {bm.markets.map((market: any) => (
                                  <div key={market.key} className="mb-4">
                                    <h5 className="font-medium text-[#848BAC] uppercase text-sm mb-2">
                                      {marketLabels[market.key] || market.key}
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {market.outcomes.map((outcome: any) => (
                                        <div
                                          key={`${outcome.name}-${outcome.description || outcome.point}`}
                                          className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                                            bets.find(
                                              (b) =>
                                                b.id === game.id &&
                                                b.team === outcome.name &&
                                                b.betDetails.market ===
                                                  market.key &&
                                                b.betDetails.description ===
                                                  outcome.description
                                            )
                                              ? "bg-[#0100821A] text-vintage-50"
                                              : "hover:bg-gray-50"
                                          }`}
                                          onClick={() =>
                                            handleSelectBet(
                                              game,
                                              outcome.name,
                                              outcome.price,
                                              market.key,
                                              outcome.point,
                                              outcome.description,
                                              bm.key
                                            )
                                          }
                                        >
                                          <p className="font-medium text-sm">
                                            {outcome.description
                                              ? `${outcome.description}: ${outcome.name} ${
                                                  outcome.point
                                                    ? `(${outcome.point})`
                                                    : ""
                                                }`
                                              : outcome.name}
                                          </p>
                                          <p className="text-sm text-[#848BAC] mb-1">
                                            {outcome.point}
                                          </p>

                                          <p className="text-xl font-bold mt-1">
                                            {formatOdds(outcome.price)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        <DrawerFooter>
                          <DrawerClose>
                            <Button
                              variant="outline"
                              className="w-full mx-auto max-w-xs"
                            >
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>

                  {availableMarkets.length > 0 && (
                    <Tabs
                      defaultValue={marketTypes[0] || "h2h"}
                      className="w-full"
                    >
                      <TabsList className="mb-4 bg-[#F8F8F8]">
                        {marketTypes.includes("h2h") && (
                          <TabsTrigger
                            value="h2h"
                            className="text-[#848BAC] text-sm"
                          >
                            Moneyline
                          </TabsTrigger>
                        )}
                        {marketTypes.includes("spreads") && (
                          <TabsTrigger
                            value="spreads"
                            className="text-[#848BAC] text-sm"
                          >
                            Spread
                          </TabsTrigger>
                        )}
                        {marketTypes.includes("totals") && (
                          <TabsTrigger
                            value="totals"
                            className="text-[#848BAC] text-sm"
                          >
                            Total
                          </TabsTrigger>
                        )}
                      </TabsList>

                      {marketTypes.includes("h2h") && (
                        <TabsContent value="h2h">
                          <div className="grid grid-cols-2 gap-2">
                            {bookmaker.markets
                              .find((m: any) => m.key === "h2h")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                                    bets.find(
                                      (b) =>
                                        b.id === game.id &&
                                        b.team === outcome.name &&
                                        b.betDetails.market === "h2h"
                                    )
                                      ? "bg-[#0100821A] text-vintage-50"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "h2h",
                                      undefined,
                                      undefined,
                                      selectedBookmakerKey
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-xl font-bold mt-1">
                                    {formatOdds(outcome.price)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {marketTypes.includes("spreads") && (
                        <TabsContent value="spreads">
                          <div className="grid grid-cols-2 gap-2">
                            {bookmaker.markets
                              .find((m: any) => m.key === "spreads")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                                    bets.find(
                                      (b) =>
                                        b.id === game.id &&
                                        b.team === outcome.name &&
                                        b.betDetails.market === "spreads"
                                    )
                                      ? "bg-[#0100821A] text-vintage-50"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "spreads",
                                      outcome.point,
                                      undefined,
                                      selectedBookmakerKey
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-sm text-[#848BAC] mb-1">
                                    {outcome.point && outcome.point > 0
                                      ? "+"
                                      : ""}
                                    {outcome.point}
                                  </p>
                                  <p className="text-xl font-bold">
                                    {formatOdds(outcome.price)}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      )}

                      {marketTypes.includes("totals") && (
                        <TabsContent value="totals">
                          <div className="grid grid-cols-2 gap-2">
                            {bookmaker.markets
                              .find((m: any) => m.key === "totals")
                              ?.outcomes.map((outcome: any) => (
                                <div
                                  key={outcome.name}
                                  className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                                    bets.find(
                                      (b) =>
                                        b.id === game.id &&
                                        b.team === outcome.name &&
                                        b.betDetails.market === "totals"
                                    )
                                      ? "bg-[#0100821A] text-vintage-50"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={() =>
                                    handleSelectBet(
                                      game,
                                      outcome.name,
                                      outcome.price,
                                      "totals",
                                      outcome.point,
                                      undefined,
                                      selectedBookmakerKey
                                    )
                                  }
                                >
                                  <p className="font-medium">{outcome.name}</p>
                                  <p className="text-sm text-[#848BAC] mb-1">
                                    {outcome.point}
                                  </p>
                                  <p className="text-xl font-bold">
                                    {formatOdds(outcome.price)}
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
