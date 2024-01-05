import * as yup from "yup";

const registerSchema = yup.object({
  name: yup.string().min(3).max(32).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(16).required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required(),
});

export default registerSchema;
