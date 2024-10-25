import * as React from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "../ui/responsive-dialog";

export function ResponsiveDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open responsive</Button>
      <ResponsiveDialog
        title="ریسپانسیو"
        openState={open}
        setOpenState={setOpen}
      >
        hi
      </ResponsiveDialog>
    </div>
  );
}
