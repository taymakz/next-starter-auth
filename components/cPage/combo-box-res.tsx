"use client"

import * as React from "react"
import { useMediaQuery } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    value: "گزینه اول",
    label: "گزینه اول",
  },
  {
    value: "گزینه دوم",
    label: "گزینه دوم",
  },
  {
    value: "گزینه سوم",
    label: "گزینه سوم",
  },
]

export function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ انتخاب</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} value={selectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ انتخاب</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <div className="mt-4 border-t ">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} value={selectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
  value
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
  value: Status | null
}) {
  return (
    <Command>
      <CommandInput placeholder="جستجو کنید ..." />
      <CommandList>
        <CommandEmpty>
          چیزی یافت نشد.
        </CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
              className={value?.value === status.value ? "!text-primary" : ""}
            >
              {status.label}
              <Check
                className={cn(
                  " h-4 w-4",
                  value?.value === status.value ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command >
  )
}
