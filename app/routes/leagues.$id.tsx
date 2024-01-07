import { useState } from "react";
import { MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Fixtures from "~/components/fixtures";
import LeagueTable from "~/components/league-table";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

import League from "~/entities/League.entity";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import cls from "classnames";

const gameSchema = yup.object({
  home: yup.number().min(0),
  away: yup.number().min(0),
});
const roundSchema = yup.array().of(gameSchema);
const fixturesSchema = yup.array().of(roundSchema);
const schema = yup.object({ fixtures: fixturesSchema });

export const meta: MetaFunction = ({ data }) => ({
  title: `${data.league.name} | Your League`,
});

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) => {
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
  const league = new League(
    loaderData.league.name,
    loaderData.league.teams,
    loaderData.league.fixtures
  );

  const simulateAll = () => {
    methods.setValue(
      "fixtures",
      league.fixtures.map((round) =>
        round.map(() => ({
          home: Math.round(Math.random() * 3),
          away: Math.round(Math.random() * 3),
        }))
      )
    );
    setIsInSimulation(true);
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fixtures: league.fixtures.map((round) =>
        round.map(() => ({ home: undefined, away: undefined }))
      ),
    },
  });
  const formFixtures = methods.watch("fixtures");
  const simulatedFixtures = league.fixtures.map((round, roundIdx) =>
    round.map((game, gameIdx) => ({
      ...game,
      homeScore: +formFixtures![roundIdx]![gameIdx].home!,
      awayScore: +formFixtures![roundIdx]![gameIdx].away!,
      finished:
        !!formFixtures![roundIdx]![gameIdx].home &&
        !!formFixtures![roundIdx]![gameIdx].away,
    }))
  );
  const [isInSimulation, setIsInSimulation] = useState(false);

  return (
    <div className="relative pl-10">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <div className="flex gap-x-2">
            <button
              className="rounded bg-green px-4 py-2 text-sm text-white transition-opacity hover:opacity-80 dark:text-black"
              onClick={simulateAll}
            >
              Simulate
            </button>
            <button
              className={cls({
                "rounded bg-blue-500 px-4 py-2 text-sm text-white transition-opacity hover:opacity-80 dark:text-black":
                  true,
                "bg-red": isInSimulation,
              })}
              onClick={() => setIsInSimulation(!isInSimulation)}
            >
              {isInSimulation ? "Exit Simulation" : "Enter in Simulation"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[85fr_25fr] gap-x-4">
          <LeagueTable
            fixtures={isInSimulation ? simulatedFixtures : league.fixtures}
            teams={league.teams}
          />
          <FormProvider {...methods}>
            <Fixtures
              inSimulation={isInSimulation}
              fixtures={isInSimulation ? simulatedFixtures : league.fixtures}
              teams={league.teams}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
