import { useState } from "react";
import { MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Fixtures from "~/components/fixtures";
import LeagueTable from "~/components/league-table";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

import League from "~/entities/League";

export const meta: MetaFunction = ({ data }) => ({
  title: `${data.league.name} | Your League`,
})

export const loader = async ({ request, params }: any) => {
  const userId = await requireUserId(request);
  try {
    const league = await db.league.findFirstOrThrow({
      where: { id: params.id, userId },
      include: { teams: true },
    });

    return { ok: true, league };
  } catch (err) {
    console.error(err);
    return redirect("/");
  }
};

export default function LeaguePage() {
  const loaderData = useLoaderData();
  const league = new League(loaderData.league.name, loaderData.league.teams, loaderData.league.fixtures);

  const [simulatedFixtures, setSimulatedFixtures] = useState([...league.fixtures]);

  const simulate = () => {
    setSimulatedFixtures(simulatedFixtures.map(round => round.map((game) => ({
      ...game,
      homeScore: Math.round(Math.random() * 3),
      awayScore: Math.round(Math.random() * 3),
      finished: true,
    }))));
  }

  const simulateGame = (roundIdx: number, gameIdx: number, homeScore: number, awayScore: number) => {
    setSimulatedFixtures(
      simulatedFixtures.map((oldRound, oldRoundIdx) => oldRoundIdx === roundIdx ? oldRound.map((oldGame: any, oldGameIdx: any) => gameIdx === oldGameIdx ? ({...oldGame, homeScore, awayScore, finished: true}) : oldGame) : oldRound)
    )
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-3xl">{league.name}</h1>
        <button className="px-4 py-2 text-sm bg-green-500 text-white rounded" onClick={simulate}>Simulate</button>
      </div>

      <div className="grid grid-cols-[85fr_25fr] gap-x-4">
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
