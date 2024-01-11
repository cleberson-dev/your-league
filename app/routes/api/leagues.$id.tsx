import { redirect } from "@remix-run/node";
import { Fixtures, Game } from "~/entities/League.entity";
import * as service from "~/utils/service.server";

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { [key: string]: string };
}) => {
  const leagueId = params.id;

  if (request.method === "PATCH") {
    const league = await service.getLeague(leagueId);
    const payload = await request.json();
    const fixtures = (league?.fixtures as Fixtures).map((round, roundIdx) =>
      round!.map((game, gameIdx): Game => {
        const home = payload.fixtures[roundIdx]?.[gameIdx]?.home ?? null;
        const away = payload.fixtures[roundIdx]?.[gameIdx]?.away ?? null;

        if (home === null && away === null)
          return {
            ...game,
            homeScore: undefined,
            awayScore: undefined,
            finished: undefined,
          };


        if (home === null || away === null) return game;
        
        return {
          ...game,
          homeScore: home,
          awayScore: away,
          finished: true,
        };
      })
    );
    await service.updateLeague(leagueId, { fixtures });

    return { ok: true };
  }

  if (request.method === "DELETE") {
    await service.removeLeague(leagueId);
    return redirect("/dashboard");
  }
};
