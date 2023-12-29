import CreatableSelect from "react-select/creatable";
import Button from "./button";
import { Team } from "~/entities/League";
import { useForm, Form, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  teams: Team[];
  onClose: () => void;
};

const schema = yup
  .object({
    name: yup.string().required(),
    teams: yup.array().of(yup.string()).min(4).required(),
  })
  .required();

export default function CreateLeagueModal({ teams, onClose }: Props) {
  const { control, register, formState: { errors, isValid }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="z-20 absolute left-0 top-0 flex h-[100svh] w-full items-center justify-center bg-black/10">
      <Form className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow" control={control}>
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
              className="w-60 rounded border border-solid border-black/10"
              {...register("name")}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block">Teams</label>
            <div className="mb-2 flex flex-col gap-y-2">
              <Controller
                name="teams"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    isMulti
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={newValues => field.onChange(newValues.map(({ value }) => value))}
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
                )}
              />
             
              {errors.teams && <span className="text-red-500">{errors.teams.message}</span>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-2">
          <Button type="submit" disabled={!isValid}>Create</Button>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </Form>
    </div>
  );
}
