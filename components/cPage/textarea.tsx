import { Textarea } from "@/components/ui/textarea";

export function TextareaDemo() {
  return (
    <div className="flex w-full gap-4">
      <Textarea variant={"default"} label="محتوای خود " />
      <Textarea variant={"floating-label"} label="محتوای خود " />
    </div>
  );
}
