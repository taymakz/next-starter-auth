import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">مدال</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ویرایش </DialogTitle>
          <DialogDescription>جزئیات حساب کاربری</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">hi</div>
        <DialogFooter>
          <Button type="submit" className="w-20">
            ثبت
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
