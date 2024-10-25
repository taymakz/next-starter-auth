import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "flex w-full  rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 duration-300",

  {
    variants: {
      variant: {
        default:
          "h-12 px-3 py-2 resize-none min-h-[80px] max-h-[180px]  focus:border-primary transition-colors rtl:focus:placeholder:-translate-x-3 placeholder:transition-transform placeholder:duration-300 ",
        "floating-label":
          "relative block min-h-[80px] px-4 py-3.5 focus-within:border-primary cursor-text [&_textarea]:border-none [&_textarea]:bg-transparent [&_textarea]:w-full  [&_textarea]:placeholder-transparent [&_textarea]:focus:border-transparent [&_textarea]:focus:outline-none [&_textarea]:outline-none [&_textarea]:resize-none [&_textarea]:max-h-[180px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, variant, ...props }, ref) => {
    const randomId = React.useId();
    return (
      <>
        {variant === "default" && (
          <div className="relative w-full">
            <textarea
              className={cn(textareaVariants({ variant, className }))}
              ref={ref}
              {...props}
              placeholder={label}
            />
          </div>
        )}
        {variant === "floating-label" && (
          <label
            htmlFor={props.name || randomId}
            dir={props.dir}
            className={cn(textareaVariants({ variant, className }))}
          >
            <textarea
              id={props.name || randomId}
              className="peer"
              ref={ref}
              {...props}
              placeholder={label}
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 rounded-lg bg-background px-2 py-0.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">
              {label}
            </span>
          </label>
        )}
      </>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
