"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./aspect-ratio";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import Link from "next/link";
import { Book } from "@/type";

export const CardItem = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Book;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn("p-4 hover:-translate-y-2 transition-all duration-300 ease-in",

        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <CardContent className="overflow-hidden rounded-lg relative p-0">
      <div className={cn( "absolute opacity-0 flex items-end justify-center p-4 z-4 bg-black/40 w-full h-full", hovered === index  && "opacity-100",)}>
        <h1 className="text-center text-2xl font-bold">
          {card?.title}
        </h1>
      </div>
      <AspectRatio ratio={4/5} >
        <Image
          src={`${card?.cover??"/#"}`}
          alt={card?.title}
          fill
          className="object-cover relative z-3 inset-0"
        />
      </AspectRatio>

  
      </CardContent>
     
    </Card>
  )
);

CardItem.displayName = "CardItem";

type CardItem = {
  name: string;
  slug: string;
  descriptions:string;
};

export function FocusCards({ data }: { data: Book[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 px-30 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {data?.map((card, index) => (
        <Link key={index} href={`${card?.slug??"/#"}`}>
          <CardItem
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        </Link>

      ))}
    </div>
  );
}
