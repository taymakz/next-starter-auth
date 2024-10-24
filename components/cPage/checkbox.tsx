import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckBoxDemo() {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <Label htmlFor="terms">
          قوانین را خواندم
        </Label>
        <Checkbox id="terms" />
      </div>
    </div>
  )
}
