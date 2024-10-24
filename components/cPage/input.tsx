import { Input } from "@/components/ui/input"

export function InputDemo() {
  return (
    <div className="flex gap-4 items-center w-full">
      <Input variant={"default"} type="text" label="شماره موبایل یا ایمیل" />
      <Input variant={"floating-label"} type="password" dir="ltr" label="شماره موبایل یا ایمیل" />
    </div>
  )
}
