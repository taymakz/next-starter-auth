import { useEffect, useMemo, useState } from "react";

// Helper function to generate random points
const generatePoints = (length: number) =>
  Array.from({ length })
    .fill(0)
    .map(() => [Math.random(), Math.random()]);

// Helper function to manipulate point values
const jumpVal = (val: number) =>
  Math.random() > 0.5 ? val + (Math.random() - 0.5) / 2 : Math.random();

export function AnimatedBackground() {
  const [points, setPoints] = useState(() => generatePoints(16));

  const poly = useMemo(() => {
    points.map(([x, y]) => `${x! * 100}% ${y! * 100}%`).join(", ");
  }, [points]);

  // Update points periodically
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const jumpPoints = () => {
      setPoints((prevPoints) =>
        prevPoints.map(([x, y]) => [jumpVal(x), jumpVal(y)]),
      );
      timeout = setTimeout(jumpPoints, 2000 + Math.random() * 1000);
    };

    jumpPoints(); // Start the interval

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  return (
    <div
      className="animated-background absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      aria-hidden="true"
    >
      <div
        className="xs:opacity-50 aspect-[1.7] h-full w-full bg-gradient-to-r from-primary to-white/10 lg:opacity-30"
        style={{ clipPath: `polygon(${poly})` }}
      />
    </div>
  );
}
