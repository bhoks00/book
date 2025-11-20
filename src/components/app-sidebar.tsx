"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useFetchData } from "@/hooks/useFetchData";
import { BookIcon } from "lucide-react";
import { IconBook, IconBookmarkAi } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

export function SidebarMain({children}) {
  const {data} = useFetchData('/',"root")
  const [links, setLink] = useState<[]>()
  // useEffect(()=>{
  //   if (data){
  //     const listLink:any = []
  //     data.map((link:any)=>{
  //         listLink.push({
  //           'title':link.title,
  //           'url':link.url,
  //           'icon':  <IconBook className="w-4 h-4"/>
  //         })
  //     }) 
  //     setLink(listLink)
  //   }
      
  //   setLink(data)
  // },[data])
 
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-auto rounded-md border",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} >
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links?.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>

          </div>
        </SidebarBody>
      </Sidebar>
  
      <div className="md:pl-16">
        {children}
      </div>
      {/* <Dashboard /> */}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <LogoIcon />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Try It
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    > 
    <AspectRatio ratio={1/1}>
          <Image alt="try-log" src="/logo.png" className="w-12 h-12 object-contain" fill />

    </AspectRatio>
    </Link>
  );
};

