"use client"

import { ThemeToggle } from "@/components/common/theme-toggle";
import { BadgeDemo } from "@/components/cPage/badge";
import { BreadcrumbWithCustomSeparator } from "@/components/cPage/breadcrumb";
import { ButtonDemo } from "@/components/cPage/button";
import { CardDemo } from "@/components/cPage/card";
import { CarouselPlugin } from "@/components/cPage/carousel";
import { CheckBoxDemo } from "@/components/cPage/checkbox";
import { ComboBoxResponsive } from "@/components/cPage/combo-box-res";
import { AlertDialogDemo } from "@/components/cPage/alert";
import { DialogDemo } from "@/components/cPage/dialog";
import { DrawerDemo } from "@/components/cPage/drawer";
import { ResponsiveDialogDemo } from "@/components/cPage/resposive-dialog";
import { DropdownMenuDemo } from "@/components/cPage/dropdown";
import { PopoverDemo } from "@/components/cPage/popover";
import { SelectScrollable } from "@/components/cPage/select";
import { SkeletonDemo } from "@/components/cPage/skeleton";
import { TooltipDemo } from "@/components/cPage/tooltip";
import { InputOTPPattern } from "@/components/cPage/input-otp";
import { InputDemo } from "@/components/cPage/input";
import { TextareaDemo } from "@/components/cPage/textarea";

export default function Components() {
  return (
    <>
      <div className="absolute left-2 top-2 z-10">
        <ThemeToggle />
      </div>
      <div className="relative py-20">
        <div className="container  space-y-10">
          <div className="flex gap-20 items-center flex-wrap">
            <AlertDialogDemo />

            <BadgeDemo />
            <BreadcrumbWithCustomSeparator />
            <ButtonDemo />
            <CheckBoxDemo />
            <ComboBoxResponsive />
            <DialogDemo />
            <DrawerDemo />
            <ResponsiveDialogDemo />
            <DropdownMenuDemo />
            <PopoverDemo />
            <SelectScrollable />
            <SkeletonDemo />
            <TooltipDemo />
          </div>

          <div className="flex justify-center">
            <InputOTPPattern />
          </div>
          <div className="flex justify-center max-w-xl mx-auto">
            <InputDemo />
          </div>
          <div className="flex justify-center max-w-xl mx-auto">
            <TextareaDemo />
          </div>
          <div>
            <CardDemo className="mx-auto" />
          </div>



          <div className="w-full">
            <CarouselPlugin />
          </div>


        </div>
      </div>
    </>
  );
}
