import { useForm, Form } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./button";
import createTeamSchema from "~/schemas/create-team.schema";

type Props = {
  onClose: () => void;
};

export default function CreateTeamModal({ onClose }: Props) {
  const {
    control,
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createTeamSchema),
  });

  return (
    <Form
      encType="multipart/form-data"
      className="flex h-3/4 w-3/4 flex-col rounded bg-white p-8 shadow"
      control={control}
    >
      <input readOnly name="actionType" value="createTeam" className="hidden" />

      <h1 className="mb-8 text-2xl font-bold">Create your team</h1>
      <div className="flex flex-grow flex-col gap-y-8">
        <div>
          <label className="block">Name</label>
          <input
            className="w-60 rounded border border-solid border-black/10"
            autoComplete="off"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
        <div>
          <label className="block">Logo</label>
          <input
            type="file"
            accept=".jpeg, .png, .svg, .jpg"
            {...register("logo")}
          />
          {errors.logo && (
            <span className="text-xs text-red-500">{errors.logo.message}</span>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-x-2">
        <Button type="submit" disabled={!isValid}>
          Create
        </Button>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </Form>
  );
}
