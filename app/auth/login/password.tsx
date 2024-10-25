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
import { MESSAGE_ERROR_500 } from "@/lib/error-message";
import { AuthenticationPassword } from "@/lib/actions/authenticate";
import {
  AuthenticateSectionEnum,
  VerificationOTPUsageEnum,
} from "@/lib/types/authenticate";
import { schemaAuthenticatePassword } from "@/lib/zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import * as z from "zod";
import { RequestVerificationOTP } from "@/lib/actions/messages";

interface PropsType {
  username: string;
  setSection: (value: AuthenticateSectionEnum) => void;
  setCanLoginWithPassword: (value: boolean) => void;
}

export function PasswordSection({
  username,
  setSection,
  setCanLoginWithPassword,
}: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof schemaAuthenticatePassword>>({
    mode: "all",
    resolver: zodResolver(schemaAuthenticatePassword),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schemaAuthenticatePassword>) {
    const validationResult = schemaAuthenticatePassword.safeParse(values);
    if (!validationResult.success) return;
    setLoading(true);
    const result = await AuthenticationPassword(username, values.password);

    if (result.success) {
      toast(result.message);
      router.push(searchParams.get("backURL") || "/");
    } else {
      form.setError("password", { message: result?.message });
    }
    setLoading(false);
  }

  async function redirectToOneTimePassword() {
    if (loading) return;
    setLoading(true);
    const result = await RequestVerificationOTP(
      username,
      VerificationOTPUsageEnum.AUTHENTICATE,
    );
    if (!result) {
      toast(MESSAGE_ERROR_500);
      setLoading(false);
      return;
    }
    if (result.success) {
      setCanLoginWithPassword(true);
      setSection(AuthenticateSectionEnum.OTP);
    }
    if (result.message) toast(result.message);
    setLoading(false);
  }

  function rediectToForgotPassword() {
    localStorage.setItem("username", username);
    router.push("/auth/forgot");
  }

  function getBack() {
    setSection(AuthenticateSectionEnum.CHECK);
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
      <h1 className="mb-6 text-center text-lg font-medium">
        کلمه عبور را وارد کنید
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input */}
          <div>
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
                    />
                  </FormControl>

                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <ul className="mb-8 space-y-4">
            <li>
              <div
                onClick={() => redirectToOneTimePassword()}
                className="flex cursor-pointer items-center gap-x-1 text-sm text-primary duration-200 hover:text-primary/80"
              >
                <span>ورود با رمز یک بار مصرف</span>
                <span>
                  <ChevronLeft className="size-5" />
                </span>
              </div>
            </li>
            <li>
              <div
                onClick={() => rediectToForgotPassword()}
                className="flex cursor-pointer items-center gap-x-1 text-sm text-primary duration-200 hover:text-primary/80"
              >
                <span> فراموشی رمز عبور </span>
                <span>
                  <ChevronLeft className="size-5" />
                </span>
              </div>
            </li>
          </ul>
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
