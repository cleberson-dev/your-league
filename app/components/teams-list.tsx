import { Team } from "~/entities/League.entity";
import PaginationControls from "./pagination-controls";
import TeamCard from "./team-card";
import { TrashIcon } from "@heroicons/react/16/solid";
import { useModal } from "~/contexts/Modal.context";
import RemoveConfirmationModal from "./remove-confirmation.modal";
import { Form } from "@remix-run/react";

type Props = {
  teams: Team[];
  removable?: boolean;
};

export default function TeamsList({ teams, removable }: Props) {
  const { showModal, hideModal } = useModal();

  if (teams.length === 0)
    return (
      <p className="my-8 text-center text-2xl font-bold text-black/20">
        No Teams
      </p>
    );

  return (
    <>
      <PaginationControls isNext />
      <ul className="mt-5 flex gap-x-4 overflow-auto">
        {teams.map((team) => (
          <li key={team.id} className="relative">
            {removable && (
              <div className="absolute right-2 top-2 z-20">
                <button
                  className="rounded-full bg-white/20 p-2 hover:bg-white/10"
                  onClick={() =>
                    showModal(
                      <Form method="DELETE" action={`/api/teams/${team.id}`}>
                        <RemoveConfirmationModal onClose={hideModal} />
                      </Form>
                    )
                  }
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            )}
            <TeamCard team={team} removable={removable} />
          </li>
        ))}
      </ul>
    </>
  );
}
