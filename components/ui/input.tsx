import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { EyeIcon, EyeOff } from "lucide-react"


const inputVariants = cva(
  "flex w-full rounded-lg border border-input bg-background text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 duration-300 ",

  {
    variants: {
      variant: {
        default: "h-12 px-3 py-2 focus:border-primary transition-colors rtl:focus:placeholder:-translate-x-3 placeholder:transition-transform placeholder:duration-300 placeholder:text-right",
        "floating-label": "relative block  [&_input]:px-4 [&_input]:py-3.5 [&_input]:rounded-lg focus-within:border-primary cursor-text [&_input]:border-none [&_input]:bg-transparent [&_input]:w-full [&_input]:placeholder-transparent [&_input]:focus:border-transparent [&_input]:focus:outline-none [&_input]:outline-none [&_input]:placeholder:text-right"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


export type RegexType = 'ONLY_DIGIT' | 'ONLY_CHAR' | 'ONLY_DIGIT_CHAR';
const regexPatterns: Record<RegexType, RegExp> = {
  ONLY_DIGIT: /^[0-9]*$/,
  ONLY_CHAR: /^[a-zA-Z]*$/,
  ONLY_DIGIT_CHAR: /^[a-zA-Z0-9]*$/,

};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  regex?: RegexType;
  label?: string
  labelClass?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", type, label, labelClass, regex, ...props }, ref) => {
    const [togglePasswordReveal, setTogglePasswordReveal] = React.useState(false)
    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      // if regex does not provided, All Chars are Available
      const pattern = regex ? regexPatterns[regex] : /.*/;
      if (pattern.test(value)) {
        setInputValue(value);
        if (props.onChange) {
          props.onChange(event);
        }
      }
    };
    const randomId = React.useId()
    return (
      <>

        {
          variant === 'default' && (
            <div className="relative w-full">
              <input
                type={togglePasswordReveal ? 'text' : type}
                className={cn(
                  inputVariants({ variant, className }),
                  type === 'password' ? '!pe-12' : ''
                )}
                value={inputValue}
                onChange={handleInputChange}
                ref={ref}

                {...props}
                placeholder={label}

              />
              {/* Password Reveal */}
              {type === 'password' && (
                <div dir={props.dir}>
                  <PasswordReveal
                    togglePasswordReveal={togglePasswordReveal}
                    setTogglePasswordReveal={setTogglePasswordReveal} />
                </div>
              )}

            </div>
          )
        }
        {
          variant === 'floating-label' && (
            <div className="relative w-full ">
              <label
                htmlFor={props.id || props.name || randomId}

                className={cn(
                  inputVariants({ variant, className }),
                )}
              >
                <input
                  dir={props.dir}
                  id={props.id || props.name || randomId}
                  className={cn('peer h-full w-full',
                    type === 'password' ? '!pe-12' : '')}
                  type={togglePasswordReveal ? 'text' : type}
                  value={inputValue}

                  ref={ref}
                  {...props}
                  onChange={handleInputChange}
                  placeholder={label}
                />

                {label && (<span
                  className={cn("pointer-events-none absolute start-2.5 px-2 top-0 -translate-y-1/2 bg-secondary py-0.5 text-muted-foreground text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:text-primary peer-focus:top-0 peer-focus:text-xs rounded-lg", labelClass)}

                >
                  {label}
                </span>)}
              </label>
              {/* Password Reveal */}

              {(type === 'password' && inputValue.length !== 0) && (
                <div dir={props.dir}>
                  <PasswordReveal
                    togglePasswordReveal={togglePasswordReveal}
                    setTogglePasswordReveal={setTogglePasswordReveal} />
                </div>
              )}
            </div>
          )
        }
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }

function PasswordReveal({ setTogglePasswordReveal, togglePasswordReveal }: {
  setTogglePasswordReveal: (state: boolean) => void,
  togglePasswordReveal: boolean
}) {

  return (
    <span className="absolute end-4 inset-y-0 flex items-center justify-center">
      <span className="text-muted-foreground cursor-pointer " onClick={() => setTogglePasswordReveal(!togglePasswordReveal)}>
        {togglePasswordReveal ? <EyeIcon /> : <EyeOff />}
      </span>
    </span>
  )
}
