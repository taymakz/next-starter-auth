import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { ResponsiveDialog } from "../ui/responsive-dialog"

export function ResponsiveDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Open responsive
      </Button>
      <ResponsiveDialog title="ریسپانسیو" openState={open} setOpenState={setOpen}>

        hi
      </ResponsiveDialog>
    </div>
  )


}
