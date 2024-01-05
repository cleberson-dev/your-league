import { unauthorized } from "remix-utils";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: { request: Request }) => {
  const userId = await getUserId(request);
  if (!userId) return unauthorized({});

  const teams = await db.team.findMany({ where: { userId } });
  return teams;
};
