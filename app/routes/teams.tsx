import Breadcrumb from "~/components/breadcrumb";
import { requireUserId } from "~/utils/session.server";
import * as service from "~/utils/service.server";
import { useLoaderData } from "@remix-run/react";
import TeamLogo from "~/components/team-logo";

export const loader = async ({ request }: { request: Request }) => {
  const userId = await requireUserId(request);
  const teams = await service.getUserTeams(userId);

  return { teams };
};

export default function TeamsPage() {
  const { teams } = useLoaderData<typeof loader>();
  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Teams" }]}
      />

      <ul className="flex select-none flex-col gap-y-3 rounded uppercase">
        {teams.map((team) => (
          <li
            key={team.id}
            className="group relative overflow-hidden rounded bg-primary-dark py-4 pl-28 text-black transition-colors hover:text-violet dark:bg-dark dark:text-white"
          >
            <TeamLogo
              team={team}
              className="absolute left-0 top-0 w-24 -translate-y-4 -rotate-12 transform opacity-50 transition-transform group-hover:scale-110"
            />
            <strong>{team.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
