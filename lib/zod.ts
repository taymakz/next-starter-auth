import * as zod from "zod";
import { passwordRegex, usernameRegex } from "./validators";

// Custom error message
const requiredError = "این فیلد الزامی می باشد";

// Extend ZodString to include the `required` method
zod.ZodString.prototype.required = function (message = requiredError) {
  return this.min(1, { message }); // This adds the required validation
};

// Optionally declare the module for TypeScript
declare module "zod" {
  interface ZodString {
    required(message?: string): this;
  }
}

export const schemaUsername = zod.object({
  username: zod
    .string()
    .required()
    .refine((val) => usernameRegex.test(val), {
      message: "شماره موبایل و یا ایمیل نامعتبر است",
    }),
});

export const schemaAuthenticatePassword = zod.object({
  password: zod.string().required(),
});
export const schemaAuthenticateOneTimePassword = zod.object({
  code: zod.string().required().min(4, ""),
});

export const schemaChangePassword = zod
  .object({
    password: zod
      .string()
      .required()
      .refine((val) => passwordRegex.test(val), {
        message: "",
      }),
    confirm_password: zod.string().required(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "کلمه های عبور یکسان نیستند",
    path: ["confirm_password"],
  });
