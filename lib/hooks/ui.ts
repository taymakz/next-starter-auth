import { useEffect, useMemo, useState } from "react";
import {
  passwordHasLowercase,
  passwordHasNumber,
  passwordHasUppercase,
  passwordIsValidPasswordLength,
} from "../validators";

export function useResetPasswordValidation(password: string) {
  const [lowercaseValid, setLowercaseValid] = useState(false);
  const [uppercaseValid, setUppercaseValid] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [lengthValid, setLengthValid] = useState(false);

  // Update the validation states when the password changes
  useEffect(() => {
    setLowercaseValid(passwordHasLowercase(password));
    setUppercaseValid(passwordHasUppercase(password));
    setNumberValid(passwordHasNumber(password));
    setLengthValid(passwordIsValidPasswordLength(password));
  }, [password]);

  // Calculate the validation class based on valid count
  const getValidationClass = useMemo(() => {
    const validCount = [
      lowercaseValid,
      uppercaseValid,
      numberValid,
      lengthValid,
    ].filter(Boolean).length;

    switch (validCount) {
      case 0:
        return "bg-muted w-0";
      case 1:
        return "bg-warning w-1/4";
      case 2:
        return "bg-yellow-500 dark:bg-yellow-400 w-2/4";
      case 3:
        return "bg-blue-500 dark:bg-blue-400 w-3/4";
      case 4:
        return "bg-success w-full";
      default:
        return "";
    }
  }, [lowercaseValid, uppercaseValid, numberValid, lengthValid]);

  return {
    lowercaseValid,
    uppercaseValid,
    numberValid,
    lengthValid,
    getValidationClass,
  };
}
