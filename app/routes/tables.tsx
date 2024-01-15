import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Breadcrumb from "~/components/breadcrumb";
import LeagueTable from "~/components/league-table";
import { Fixtures } from "~/entities/League.entity";
import * as service from "~/utils/service.server";
import { requireUserId } from "~/utils/session.server";
import cls from "classnames";
import Select from "~/components/select";

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

export default function TablesPage() {
  const { leagues } = useLoaderData<typeof loader>();
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tables" },
        ]}
      />

      <div className={cls(["hidden", Object.values(className).join(" ")])} />
      <Select
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
      />

      <LeagueTable
        teams={selectedLeague.teams}
        fixtures={selectedLeague.fixtures as Fixtures}
      />
    </div>
  );
}
