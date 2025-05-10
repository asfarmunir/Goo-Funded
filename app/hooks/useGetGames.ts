import { useQuery } from "@tanstack/react-query";
import { getGames } from "../mutations/get-games";

interface GetGamesParams {
  sportKey: string;
  oddsFormat: "decimal" | "american";
}

export const useGetGames = ({
  sportKey = "americanfootball_nfl",
  oddsFormat = "american",
}: GetGamesParams) => {
  return useQuery({
    queryKey: ["games", { sportKey, oddsFormat }],
    queryFn: () => getGames({ sportKey, oddsFormat }),
  });
};
