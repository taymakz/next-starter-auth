import { useCallback, useEffect, useState } from "react";

// Define the types for the `useTimer` arguments
interface UseTimerArgs {
  second?: number;
  minute?: number;
  hour?: number;
}

// Custom `useInterval` hook
function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
}

// Define the types for the return value of `useTimer`
interface UseTimerReturn {
  isPending: boolean;
  getFormattedCounter: () => string;
  resetTimer: () => void;
}

export function useTimer({
  second = 0,
  minute = 0,
  hour = 0,
}: UseTimerArgs): UseTimerReturn {
  const totalTimeInSeconds = second + minute * 60 + hour * 60 * 60;

  const [counter, setCounter] = useState<number>(totalTimeInSeconds);
  const [isPending, setIsPending] = useState<boolean>(true);

  // Start an interval that decrements the counter
  useInterval(
    () => {
      if (counter > 0) {
        setCounter((prev) => prev - 1);
      } else {
        setIsPending(false); // Turn isPending false when the counter reaches zero
      }
    },
    isPending ? 1000 : null,
  ); // Interval runs only if pending

  // Reset timer
  const resetTimer = useCallback(() => {
    setCounter(totalTimeInSeconds);
    setIsPending(true); // Reset isPending to true when resetting the timer
  }, [totalTimeInSeconds]);

  // Get formatted counter
  const getFormattedCounter = useCallback((): string => {
    const formattedMinutes = Math.floor(counter / 60);
    const formattedSeconds = counter % 60;
    return `${formattedSeconds.toString().padStart(2, "0")} : ${formattedMinutes}`;
  }, [counter]);

  return {
    isPending,
    getFormattedCounter,
    resetTimer,
  };
}
