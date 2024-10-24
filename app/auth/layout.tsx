"use client"

import { ReactNode } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/common/theme-toggle";
import BackgroundPatternGrid from "@/components/ui/background-patterns/grid";
import { Spotlight } from "@/components/ui/spotlight";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { AnimatedBackground } from "@/components/ui/animation/background/animated-backround";
import useMeasure from "react-use-measure"
import { motion, AnimatePresence } from "framer-motion";
interface PropType {
  children: ReactNode;
}
export default function AuthLayout({ children }: PropType) {
  const [ref, bounds] = useMeasure()
  return (
    <div className="bg-background bg-dot-white/5 relative  flex h-screen w-full items-center justify-center overflow-hidden">

      <BackgroundPatternGrid />
      <AnimatedBackground />
      <div className="absolute inset-x-0 top-2 flex justify-center ">
        <div >
          <ThemeToggle />
        </div>
      </div>

      <div className="container relative z-10">


        <Card className={cn("mx-auto max-w-[400px] py-4 relative ")}>
          <div className="overflow-hidden">
            <AnimatePresence initial={true}>
              <motion.div animate={{ height: bounds.height }} >
                <div ref={ref}>
                  <CardHeader className="mb-4">
                    <div className=" flex justify-center">
                      <Link href="/">
                        <Logo className="h-8" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent >
                    {children}
                  </CardContent>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

      </div>
      <Spotlight
        className=" left-0 top-0 h-auto"
        fill="hsl(var(--foreground))"
      />

    </div>
  )
}
