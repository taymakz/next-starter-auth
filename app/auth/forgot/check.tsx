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
import { ForgotPasswordCheck } from "@/lib/actions/authenticate";
import { ForgotPasswordSectionEnum } from "@/lib/types/authenticate";
import { schemaUsername } from "@/lib/zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

interface PropsType {
  username: string;
  setUsername: (value: string) => void;
  setSection: (value: ForgotPasswordSectionEnum) => void;
}

export function ForgotCheckSection({
  setSection,
  setUsername,
  username,
}: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schemaUsername>>({
    mode: "all",
    resolver: zodResolver(schemaUsername),
    defaultValues: {
      username,
    },
  });

  async function onSubmit(values: z.infer<typeof schemaUsername>) {
    const validationResult = schemaUsername.safeParse(values);
    if (!validationResult.success) return;
    setLoading(true);
    const result = await ForgotPasswordCheck(values.username);
    if (result.success) {
      setUsername(values.username);
      // Change Section to OTP
      setSection(ForgotPasswordSectionEnum.OTP);
    } else {
      form.setError("username", { message: result?.message });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (localStorage.username) {
      form.setValue("username", localStorage.username);
      form.trigger();
      localStorage.removeItem("username");
    }
  }, []);
  return (
    <div>
      {/* Ttile */}
      <h1 className="mb-6 text-center text-lg font-medium">
        فراموشی کلمه عبور
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input */}
          <div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      variant={"floating-label"}
                      className="bg-transparent"
                      labelClass="bg-card"
                      label="شماره موبایل و یا ایمیل"
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
          {/* Button */}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={!form.formState.isValid || loading}
          >
            بازیابی کلمه عبور
          </Button>
        </form>
      </Form>
    </div>
  );
}
