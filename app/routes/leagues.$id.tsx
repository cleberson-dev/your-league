import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Fixtures from "~/components/fixtures";
import LeagueTable from "~/components/league-table";
import TeamsList from "~/components/teams-list";
import League from "~/entities/League";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader = async ({ request, params }: any) => {
  const userId = await requireUserId(request);
  try {
    const league = await db.league.findFirstOrThrow({
      where: { id: params.id, userId },
      include: { teams: true },
    });

    return { ok: true, league };
  } catch (err) {
    console.log({ err });
    return redirect("/");
  }
};

export default function LeaguePage() {
  const loaderData = useLoaderData();
  const league = new League(loaderData.league.name, loaderData.league.teams, loaderData.league.fixtures);

  const [simulatedFixtures, setSimulatedFixtures] = useState([...league.fixtures]);

  const simulateGame = (roundIdx: number, gameIdx: number, homeScore: number, awayScore: number) => {
    setSimulatedFixtures(
      simulatedFixtures.map((oldRound, oldRoundIdx) => oldRoundIdx === roundIdx ? oldRound.map((oldGame: any, oldGameIdx: any) => gameIdx === oldGameIdx ? ({...oldGame, homeScore, awayScore, finished: true}) : oldGame) : oldRound)
    )
  }
  
  return (
    <div>
      <h1>League: {league.name}</h1>

      <TeamsList teams={league.teams} />

      <div className="grid grid-cols-[8fr_2fr]">
        <LeagueTable fixtures={simulatedFixtures} teams={league.teams} />
        <Fixtures 
          fixtures={simulatedFixtures} 
          teams={league.teams} 
          onTeamClicked={(roundIdx, gameIdx, homeOrAway) => {
            simulateGame(roundIdx, gameIdx, homeOrAway === "home" ? 3 : 0, homeOrAway === "away" ? 3 : 0);
          }}
        />
      </div>
    </div>
  );
}
