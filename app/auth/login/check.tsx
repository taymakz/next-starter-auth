"use client"


import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MESSAGE_ERROR_500 } from "@/lib/error-message"
import { AuthenticationCheck } from "@/lib/actions/authenticate"
import { AuthenticateSectionEnum } from "@/lib/types/authenticate"
import { schemaUsername } from "@/lib/zod"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner"

import * as z from 'zod'
interface PropsType {
  username: string
  setUsername: (value: string) => void
  setSection: (value: AuthenticateSectionEnum) => void

}

export function CheckSection({ setSection, setUsername, username }: PropsType) {

  const [loading, setLoading] = useState<boolean>(false)


  const form = useForm<z.infer<typeof schemaUsername>>({
    mode: 'all',
    resolver: zodResolver(schemaUsername),
    defaultValues: {
      username
    }
  })

  async function onSubmit(values: z.infer<typeof schemaUsername>) {

    const validationResult = schemaUsername.safeParse(values);
    if (!validationResult.success)
      return
    setLoading(true)
    const result = await AuthenticationCheck(values.username)


    if (result.success) {
      setUsername(values.username)
      // if returned Section is OTP show user toast that sms Sent.
      if (result.data.section === AuthenticateSectionEnum.OTP)
        toast(result.message)
      // Change Section to OTP or Password Base on username
      setSection(result.data.section)
    } else {
      form.setError('username', { message: result?.message })
    }
    setLoading(false)

  }
  return (
    <div>
      {/* Ttile */}
      <h1 className="text-center font-medium text-lg mb-6">
        ورود | ثبت نام

      </h1>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >


          {/* Input */}
          <div >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem >
                  <FormControl >
                    <Input
                      type="text"
                      variant={"floating-label"}
                      className="bg-transparent"
                      labelClass="bg-card"
                      label="شماره موبایل و یا ایمیل"
                      dir="ltr"
                      autoFocus {...field}
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

          <div className="space-y-4">
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!form.formState.isValid || loading} >
              ورود
            </Button>
            <div className="text-center text-sm text-muted-foreground">

              با ورود به فروشگاه, کلیه

              <Link href="/" className="text-primary inline-block px-1">
                قوانین
              </Link>


              را می‌پذیرم.

            </div>
          </div>
        </form>

      </Form>

    </div>
  )
}
