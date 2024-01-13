import { useLoaderData } from "@remix-run/react";
import ReactSelect from "react-select";
import Breadcrumb from "~/components/breadcrumb";
import { requireUserId } from "~/utils/session.server";
import * as service from "~/utils/service.server";
import { useState } from "react";
import cls from "classnames";
import { Fixtures as IFixtures } from "~/entities/League.entity";

export const loader = async ({ request }: { request: Request }) => {
  const userId = await requireUserId(request);
  const leagues = await service.getUserLeagues(userId);

  return { leagues };
};

const className = {
  control:
    "p-2 mb-4 rounded-md text-sm border border-solid border-slate-200 bg-slate-100 dark:bg-dark dark:border-darker/60 dark:text-white",
  valueContainer: "gap-2",
  menuList: "bg-slate-100 dark:bg-dark",
  option: "p-2 text-sm hover:bg-slate-200 dark:hover:bg-violet",
};

export default function FixturesPage() {
  const { leagues } = useLoaderData<typeof loader>();
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]);
  const fixtures = selectedLeague.fixtures as IFixtures;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Fixtures" },
        ]}
      />

      <div className={cls(["hidden", Object.values(className).join(" ")])} />
      <ReactSelect
        unstyled
        defaultValue={{ label: selectedLeague.name, value: selectedLeague.id }}
        options={leagues.map((league) => ({
          label: league.name,
          value: league.id,
        }))}
        onChange={(newLeague) =>
          newLeague &&
          setSelectedLeague(
            leagues.find((league) => league.id === newLeague.value)!
          )
        }
        classNames={{
          control: () => className.control,
          valueContainer: () => className.valueContainer,
          menuList: () => className.menuList,
          option: () => className.option,
        }}
      />

      <ul className="text-sm select-none">
        {fixtures.map((round, roundIdx) => (
          <div key={roundIdx}>
            <h1 className="bg-dark py-2 text-center rounded">Round {roundIdx + 1}</h1>
            {round.map((game, gameIdx) => (
              <li key={gameIdx} className="text-center grid grid-cols-[1fr_3rem_1fr] py-2">
                <span>{selectedLeague.teams[game.homeTeam!].name}</span>
                <span>x</span>
                <span>{selectedLeague.teams[game.awayTeam!].name}</span>
              </li>
            ))}
          </div>
        ))}
      </ul>
    </div>
  );
}
