"use client";


import { motion } from "motion/react";
import { Button } from "./ui/button";
import { HexagonBackground } from "./animate-ui/components/backgrounds/hexagon";

export default function HeroSectionOne({id}:{id:string}) {
  return (
    <div id={id} className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* fillter */}

      {/* Hero */}
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative flex gap-1 md:gap-4 flex-wrap justify-center z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-100">
          {"Try It – Take Your First Step"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className={`mr-2 inline-block ${!index&&"text-primary"}`}
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-400 dark:text-neutral-300"
        >
         “Learning 1% every day is better than learning 99% at once.” 
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
         <Button size={"lg"} className="font-bold hover:-translate-y-0.5">
            Let's Try
         </Button>
         
         
        </motion.div>
    
      </div>
    </div>
  );
}

