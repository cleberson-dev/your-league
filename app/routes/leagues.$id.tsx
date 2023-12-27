import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
    const entityLeague = new League(league.name, league.teams, league.fixtures as any[]);

    return { ok: true, league: entityLeague };
  } catch (err) {
    console.log({ err });
    return redirect("/");
  }
};

export default function LeaguePage() {
  const { league } = useLoaderData();
  console.log({ league });
  return (
    <div>
      <h1>League: {league.name}</h1>

      <TeamsList teams={league.teams} />
    </div>
  );
}
