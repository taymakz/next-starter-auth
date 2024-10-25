"use client";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { MESSAGE_ERROR_500 } from "@/lib/error-message";
import { AuthenticationOneTimePassword } from "@/lib/actions/authenticate";
import {
  AuthenticateSectionEnum,
  VerificationOTPUsageEnum,
} from "@/lib/types/authenticate";
import { schemaAuthenticateOneTimePassword } from "@/lib/zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import * as z from "zod";
import { RequestVerificationOTP } from "@/lib/actions/messages";
import {
  validateEmail,
  validatePhoneNumber,
  validateUsername,
} from "@/lib/validators";
import { useTimer } from "@/lib/hooks/time";

interface PropsType {
  username: string;
  canLoginWithPassword: boolean;
  setSection: (value: AuthenticateSectionEnum) => void;
}

export function OneTimePasswordSection({
  username,
  setSection,
  canLoginWithPassword,
}: PropsType) {
  const { getFormattedCounter, resetTimer, isPending } = useTimer({
    minute: 4,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [newOtpLoading, setNewOtpLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof schemaAuthenticateOneTimePassword>>({
    mode: "onSubmit",
    resolver: zodResolver(schemaAuthenticateOneTimePassword),
    defaultValues: {
      code: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(
    values: z.infer<typeof schemaAuthenticateOneTimePassword>,
  ) {
    setLoading(true);
    const result = await AuthenticationOneTimePassword(username, values.code);

    if (result.success) {
      toast(result.message);
      router.push(searchParams.get("backURL") || "/");
    } else {
      form.setValue("code", "");
      form.setError("code", { message: result.message, type: "manual" });
      setLoading(false);
    }
  }

  async function requestNewOtp() {
    setNewOtpLoading(true);
    if (!validateUsername(username) || isPending) return;
    const result = await RequestVerificationOTP(
      username,
      VerificationOTPUsageEnum.AUTHENTICATE,
    );
    if (!result) {
      toast(MESSAGE_ERROR_500);
      setNewOtpLoading(false);
      return;
    }
    if (result.success) {
      toast(result.message);
      resetTimer();
    } else {
      setSection(AuthenticateSectionEnum.CHECK);
    }
    setNewOtpLoading(false);
  }

  function getBack() {
    setSection(AuthenticateSectionEnum.CHECK);
  }

  function getMessage(): string {
    if (validatePhoneNumber(username))
      return `کد تایید به شماره ${username} پیامک شد`;
    else if (validateEmail(username))
      return `کد تایید به ایمیل ${username} ارسال شد`;
    else return "";
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
        کد تایید را وارد کنید
      </h1>
      <p className="mb-4 text-sm text-muted-foreground">{getMessage()}</p>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div dir="ltr" className="w-full">
                    <InputOTP
                      disabled={loading}
                      onComplete={() => formRef.current?.requestSubmit()}
                      autoFocus
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <ul className="mb-8 space-y-4">
            <li>
              <button
                disabled={isPending || newOtpLoading}
                type="button"
                className="flex items-center gap-x-1 text-sm text-primary duration-200 hover:text-primary/80"
                onClick={() => requestNewOtp()}
              >
                {isPending ? (
                  <span className="text-muted-foreground">
                    زمان باقی‌مانده تا ارسال مجدد
                    <span className="ms-2 font-semibold">
                      {getFormattedCounter()}
                    </span>
                  </span>
                ) : (
                  <>
                    <span> ارسال مجدد کد تایید </span>
                    <span>
                      <ChevronLeft className="size-5" />
                    </span>
                  </>
                )}
              </button>
            </li>

            {canLoginWithPassword && (
              <li v-if="canLoginWithPassword">
                <button
                  type="button"
                  className="flex items-center gap-x-1 text-sm text-primary duration-200 hover:text-primary/80"
                  onClick={() => setSection(AuthenticateSectionEnum.PASSWORD)}
                  disabled={loading}
                >
                  <span> ورود با رمز عبور </span>
                  <span>
                    <ChevronLeft className="size-5" />
                  </span>
                </button>
              </li>
            )}
          </ul>
          {/* Button */}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={!form.formState.isValid || loading}
          >
            تایید
          </Button>
        </form>
      </Form>
    </div>
  );
}
