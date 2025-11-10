"use client"
import { NavbarMenu } from "@/components/nav";
import HeroSection from "@/components/section-hero";
import BookListSection from "@/components/section-listbook";
import { navStore} from "@/hooks/store";
import { useFetchData } from "@/hooks/useFetchData";
import { useEffect } from "react";
import '@gravity-ui/uikit/styles/styles.css';

export default function Home() {
  const {data:nav} = useFetchData("/","root")
  const {data:books} = useFetchData("/books","books")

  useEffect(()=>{
    navStore.setState(()=>nav)

  },[nav])
 
  return (
    <div>
      <NavbarMenu/>
      <HeroSection />
      <BookListSection books={books} /> 
    </div>
  );
}
