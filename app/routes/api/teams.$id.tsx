import { redirect } from "@remix-run/node";
import * as service from "~/utils/service.server";

export const action = async ({
  request,
  params,
}: {
  request: Request;
  params: { [key: string]: string };
}) => {
  const teamId = params.id;

  if (request.method === "DELETE") {
    await service.removeTeam(teamId);
    return redirect("/dashboard");
  }
};