import { useState } from "react";
import { MetaFunction, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import Fixtures from "~/components/fixtures";
import LeagueTable from "~/components/league-table";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

import League, { Fixtures as IFixtures } from "~/entities/League.entity";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "~/components/button";
import { CloudArrowUpIcon } from "@heroicons/react/16/solid";
import { useToast } from "~/contexts/Toast.context";
import Breadcrumb from "~/components/breadcrumb";
import TableFixtureScoreInput from "~/components/table-fixture-score-input";

const gameSchema = yup.object({
  home: yup.number().min(0).nullable(),
  away: yup.number().min(0).nullable(),
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

  const fetcher = useFetcher();

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
    setIsEditModeEnabled(true);
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fixtures: league.fixtures.map((round) =>
        round.map((game) => ({
          home: game.homeScore ?? null,
          away: game.awayScore ?? null,
        }))
      ),
    },
  });

  const formFixtures = methods.watch("fixtures");
  const simulatedFixtures = league.fixtures.map((round, roundIdx) =>
    round.map((game, gameIdx) => {
      const formGame = formFixtures![roundIdx]![gameIdx]!;
      const homeScore = formGame.home as number | string | null;
      const awayScore = formGame.away as number | string | null;
      const scores = [homeScore, awayScore];

      if (
        scores.some(
          (score) => score === "" || score === null || +score < 0 || +score > 99
        )
      )
        return game;

      return {
        ...game,
        homeScore: +homeScore!,
        awayScore: +awayScore!,
        finished: true,
      };
    })
  );
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);
  const { toast } = useToast();

  const onSubmit: Parameters<typeof methods.handleSubmit>[0] = (values) => {
    fetcher.submit(values as { fixtures: IFixtures }, {
      method: "PATCH",
      encType: "application/json",
      action: `/api/leagues/${loaderData.league.id}`,
    });
    setIsEditModeEnabled(false);
    toast("Saved!", "success");
  };

  const resetFixtures = () => {
    methods.setValue(
      "fixtures",
      league.fixtures.map((round) =>
        round.map(() => ({
          home: null,
          away: null,
        }))
      )
    );
  };

  return (
    <form className="relative pl-10" onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="p-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Leagues", href: "/leagues" },
            { label: league.name },
          ]}
        />
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <div className="flex gap-x-2">
            {isEditModeEnabled && (
              <>
                <Button variant="neutral" onClick={resetFixtures} confirmAction>
                  Reset
                </Button>
                <Button variant="success" onClick={simulateAll} confirmAction>
                  Simulate All
                </Button>
                <Button variant="info" type="submit">
                  <CloudArrowUpIcon className="mr-2 inline-block h-4 w-4" />
                  Save
                </Button>
              </>
            )}
            <Button
              variant={isEditModeEnabled ? "error" : "standard"}
              onClick={() => setIsEditModeEnabled(!isEditModeEnabled)}
            >
              {isEditModeEnabled ? "Exit Edit" : "Enter Edit"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[85fr_25fr] gap-x-4">
          <LeagueTable
            fixtures={isEditModeEnabled ? simulatedFixtures : league.fixtures}
            teams={league.teams}
          />
          <FormProvider {...methods}>
            <Fixtures
              fixtures={isEditModeEnabled ? simulatedFixtures : league.fixtures}
              teams={league.teams}
              renderScore={isEditModeEnabled ? {
                home: (roundIdx, gameIdx) => (
                  <TableFixtureScoreInput
                    {...methods.register(
                      `fixtures.${roundIdx!}.${gameIdx!}.home`
                    )}
                  />
                ),
                away: (roundIdx, gameIdx) => (
                  <TableFixtureScoreInput
                    {...methods.register(
                      `fixtures.${roundIdx!}.${gameIdx!}.away`
                    )}
                  />
                ),
              } : undefined}
            />
          </FormProvider>
        </div>
      </div>
    </form>
  );
}
