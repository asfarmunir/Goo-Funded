import { useQuery } from "@tanstack/react-query";
import { getGames } from "../mutations/get-games";

interface GetGamesParams {
  sportKey: string;
  oddsFormat: "decimal" | "american";
}

export const useGetGames = ({
  sportKey = "soccer_uefa_champs_league",
  oddsFormat = "american",
}: GetGamesParams) => {
  return useQuery({
    queryKey: ["games", { sportKey, oddsFormat }],
    queryFn: () => getGames({ sportKey, oddsFormat }),
  });
};
