import { z } from "zod";

const registerSchemaValidation = z.object({
  fullName: z
    .string({
      required_error: "Full Name is required",
    })
    .min(3),
  userName: z
    .string({
      required_error: "Username is required",
    })
    .min(3)
    .max(15),
  email: z
    .string({ required_error: "Email Address is required" })
    .regex(/@gmail\.com$/, { message: "Please enter valid email address!!" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      {
        message:
          "Password must be of atleast 8 characters including one capital and one small letter, numerical digit and special characters",
      }
    ),
  avatar: z.string({ required_error: "Avatar is required." }).min(1).optional(),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .min(10),
});

export { registerSchemaValidation };
