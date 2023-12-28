import CreatableSelect from "react-select/creatable";
import Button from "./button";
import { Team } from "~/entities/League";

type Props = {
  teams: Team[];
  onClose: () => void;
};

export default function CreateLeagueModal({ teams, onClose }: Props) {
  return (
    <div className="z-20 absolute left-0 top-0 flex h-[100svh] w-full items-center justify-center bg-black/10">
      <form
        method="POST"
        className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow"
      >
        <input
          readOnly
          name="actionType"
          value="createLeague"
          className="hidden"
        />

        <h1 className="mb-10 text-2xl font-bold">Create your league</h1>
        <div className="flex flex-grow flex-col gap-y-8 overflow-auto">
          <div>
            <label className="block">Name</label>
            <input
              required
              name="name"
              className="w-60 rounded border border-solid border-black/10"
            />
          </div>
          <div>
            <label className="block">Teams</label>
            <div className="mb-2 flex flex-col gap-y-2">
              <CreatableSelect
                isMulti
                name="teams"
                options={teams.map((team) => ({
                  label: team.name,
                  value: JSON.stringify({ id: team.id }),
                }))}
                getNewOptionData={(newOption) => {
                  return {
                    label: newOption,
                    value: JSON.stringify({ name: newOption }),
                  };
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-2">
          <Button type="submit">Create</Button>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </form>
    </div>
  );
}
