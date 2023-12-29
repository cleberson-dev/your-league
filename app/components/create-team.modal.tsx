import { useForm, Form } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./button"

type Props = {
  onClose: () => void;
}

const schema = yup.object({
  name: yup.string().min(3).max(32).required(),
  logo: yup.mixed().test("fileType", "File type must be png, jpeg or svg", (value: any) => {
    if (!value.length) return true; // logo should be optional
    return value.type.match(/jpg|jpeg|png|svg/);
  }),
})

export default function CreateTeamModal({ onClose }: Props) {
  const { control, register, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="z-20 fixed left-0 top-0 flex h-[100svh] w-full items-center justify-center bg-black/10">
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
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          <div>
            <label className="block">Logo</label>
            <input
              type="file"
              accept=".jpeg, .png, .svg, .jpg"
              {...register("logo")}
            />
            {errors.logo && <span className="text-red-500 text-xs">{errors.logo.message}</span>}
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
  )
}
