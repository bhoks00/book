"use client"
import { NavbarMenu } from "@/components/nav";
import HeroSection from "@/components/section-hero";
import BookListSection from "@/components/section-listbook";
import { navStore} from "@/hooks/store";
import { useFetchData } from "@/hooks/useFetchData";
import { useEffect } from "react";
import '@gravity-ui/uikit/styles/styles.css';
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";

export default function Home() {
  const {data:nav} = useFetchData("/","root")
  const {data:books} = useFetchData("/books","books")

  useEffect(()=>{
    navStore.setState(()=>nav)

  },[nav])
 
  return (
    <div>
      <HexagonBackground className="absolute z-0   mask-b-from-60% mask-b-to-100%  top-0 left-0 right-0w-full min-h-screen" />

      <NavbarMenu/>
      <HeroSection id="home" />
      <div id="book">
          <BookListSection books={books} /> 

      </div>
    </div>
  );
}
