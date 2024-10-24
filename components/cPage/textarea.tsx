import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return (
    <div className="flex gap-4  w-full">
      <Textarea variant={"default"} label="محتوای خود " />
      <Textarea variant={"floating-label"} label="محتوای خود " />
    </div>
  )



}
