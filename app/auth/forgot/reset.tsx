"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordReset } from "@/lib/actions/authenticate";
import { ForgotPasswordSectionEnum } from "@/lib/types/authenticate";
import { schemaChangePassword } from "@/lib/zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import * as z from "zod";
import { useResetPasswordValidation } from "@/lib/hooks/ui";
import { cn } from "@/lib/utils";

interface PropsType {
  username: string;
  setSection: (value: ForgotPasswordSectionEnum) => void;
}

export function ForgotResetSection({ username, setSection }: PropsType) {
  const [resetToken, setResetToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.forgotPasswordToken) {
      setResetToken(localStorage.forgotPasswordToken);
      localStorage.removeItem("forgotPasswordToken");
    } else {
      // setSection(ForgotPasswordSectionEnum.CHECK)
    }
  }, []);

  const form = useForm<z.infer<typeof schemaChangePassword>>({
    mode: "all",
    resolver: zodResolver(schemaChangePassword),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const {
    getValidationClass,
    lengthValid,
    lowercaseValid,
    numberValid,
    uppercaseValid,
  } = useResetPasswordValidation(password);

  async function onSubmit(values: z.infer<typeof schemaChangePassword>) {
    const validationResult = schemaChangePassword.safeParse(values);
    if (!validationResult.success) return;
    setLoading(true);
    const result = await ForgotPasswordReset(
      username,
      resetToken,
      values.password,
      values.confirm_password,
    );

    if (result.success) {
      localStorage.removeItem("forgotPasswordToken");
      toast(result.message);
    } else {
      if (result.data.error_input_name && result.message) {
        form.setError(
          result.data.error_input_name as "password" | "confirm_password",
          { message: result?.message },
        );
      }
    }
    setLoading(false);
  }

  function getBack() {
    setSection(ForgotPasswordSectionEnum.CHECK);
  }

  return (
    <div>
      {/* Get Back Arrow */}
      <Button
        size="icon"
        className="absolute -right-2.5 -top-2.5 h-8 w-8 rounded-full"
        onClick={getBack}
      >
        <ChevronRight />
      </Button>
      {/* Ttile */}
      <h1 className="mb-6 text-center text-lg font-medium">تغییر کلمه عبور</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-transparent"
                      labelClass="bg-card"
                      dir="ltr"
                      autoFocus
                      {...field}
                      label="کلمه عبور جدید"
                      variant={"floating-label"}
                      onInput={(v) => setPassword(v.currentTarget.value)}
                      autoComplete="off"
                    />
                  </FormControl>

                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div>
              <div className="mb-4 flex items-center gap-x-2">
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "absolute right-0 h-full rounded-full duration-300",
                      getValidationClass,
                    )}
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  animate={{
                    height:
                      lengthValid &&
                      lowercaseValid &&
                      uppercaseValid &&
                      numberValid
                        ? "0"
                        : "auto",
                  }}
                >
                  <ul className="select-none list-disc space-y-2 px-4 text-xs md:text-sm [&>li]:duration-500">
                    <li
                      className={
                        lengthValid ? "text-success" : "text-muted-foreground"
                      }
                    >
                      <p>حداقل 6 و حداکثر 18 حرف</p>
                    </li>
                    <li
                      className={
                        lowercaseValid
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      <p>شامل یک حرف کوچک</p>
                    </li>
                    <li
                      className={
                        uppercaseValid
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      <p>شامل یک حرف بزرگ</p>
                    </li>
                    <li
                      className={
                        numberValid ? "text-success" : "text-muted-foreground"
                      }
                    >
                      <p>شامل عدد</p>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-transparent"
                      labelClass="bg-card"
                      dir="ltr"
                      autoFocus
                      {...field}
                      label="تکرار کلمه عبور جدید"
                      variant={"floating-label"}
                      autoComplete="off"
                    />
                  </FormControl>

                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Button */}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={!form.formState.isValid || loading}
          >
            ورود
          </Button>
        </form>
      </Form>
    </div>
  );
}
