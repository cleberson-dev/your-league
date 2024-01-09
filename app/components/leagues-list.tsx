import { Form, Link } from "@remix-run/react";
import LeagueCard from "./league-card";
import PaginationControls from "./pagination-controls";
import { TrashIcon } from "@heroicons/react/16/solid";
import { useModal } from "~/contexts/Modal.context";
import ConfirmationModal from "./confirmation.modal";

type Props = {
  leagues: {
    id: string;
    name: string;
    teamsCount: number;
  }[];
  removable?: boolean;
};

export default function LeaguesList({ leagues, removable }: Props) {
  const { showModal, hideModal } = useModal();

  if (leagues.length === 0)
    return (
      <p className="my-8 text-center text-2xl font-bold text-black/20">
        No Leagues
      </p>
    );

  return (
    <>
      <PaginationControls isNext />
      <ul className="mt-5 flex gap-x-7 overflow-auto">
        {leagues.map((league) => (
          <li key={league.id} className="relative">
            {removable && (
              <div className="absolute right-2 top-2 z-20">
                <button
                  className="rounded-full bg-white/20 p-2"
                  onClick={() =>
                    showModal(
                      <Form
                        method="DELETE"
                        action={`/api/leagues/${league.id}`}
                      >
                        <ConfirmationModal onClose={hideModal} />
                      </Form>
                    )
                  }
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            )}
            <Link to={`/leagues/${league.id}`}>
              <LeagueCard name={league.name} teamsCount={league.teamsCount} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
