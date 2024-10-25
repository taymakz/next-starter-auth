import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { useState } from "react";

export function ButtonDemo() {
  const [loadingV, setLoadingV] = useState(false);
  return (
    <div className="flex gap-4">
      <Button onClick={() => setLoadingV(!loadingV)}>Button</Button>
      <Button variant="outline" loading={loadingV} className="w-32 gap-2">
        <UserCheck className="size-4" />
        تایید
      </Button>
    </div>
  );
}
