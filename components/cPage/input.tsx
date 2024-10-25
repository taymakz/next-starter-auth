import { Input } from "@/components/ui/input";

export function InputDemo() {
  return (
    <div className="flex w-full items-center gap-4">
      <Input variant={"default"} type="text" label="شماره موبایل یا ایمیل" />
      <Input
        variant={"floating-label"}
        type="password"
        dir="ltr"
        label="شماره موبایل یا ایمیل"
      />
    </div>
  );
}
