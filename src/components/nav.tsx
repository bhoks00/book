"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { RegisterForm } from "./form/form-register";
import { LoginForm } from "./form/form-login";




export function NavbarMenu() {
  const navItems = [
    {
      name: "Buku",
      link: "#features",
    },
    {
      name: "Tentang Kami",
      link: "#features",
    },
    {
      name: "Kontak",
      link: "#features",
    },
   
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegisterMobile, setOpenRegisterMobile] = useState(false);
  const [openLoginMobile, setOpenLoginMobile] = useState(false);
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
             <Dialog open={openLogin} onOpenChange={setOpenLogin}>
              <DialogTrigger asChild>
                   <NavbarButton variant="secondary">Login</NavbarButton>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-8">
                <DialogTitle className="text-center">Login</DialogTitle>
                <LoginForm  successCallback={()=>setOpenDialogLogin(false)}/>
              </DialogContent>
            </Dialog>
            <Dialog open={openRegister} onOpenChange={setOpenRegister}>
              <DialogTrigger asChild>
                 <NavbarButton   className="bg-primary text-white">Sign Up</NavbarButton>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-8">
                <DialogTitle className="text-center">Sign Up</DialogTitle>
                <RegisterForm  successCallback={()=>setOpenDialogRegister(false)}/>
              </DialogContent>
            </Dialog>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
            <Dialog open={openLoginMobile} onOpenChange={setOpenLoginMobile}>
              <DialogTrigger asChild>
                   <NavbarButton variant="secondary">Login</NavbarButton>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-8">
                <DialogTitle className="text-center">Login</DialogTitle>
                <LoginForm  successCallback={()=>setOpenLoginMobile(false)}/>
              </DialogContent>
            </Dialog>
            <Dialog open={openRegisterMobile} onOpenChange={setOpenRegisterMobile}>
              <DialogTrigger asChild>
                 <NavbarButton   className="bg-primary text-white">Sign Up</NavbarButton>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-8">
                <DialogTitle className="text-center">Sign Up</DialogTitle>
                <RegisterForm  successCallback={()=>setOpenRegisterMobile(false)}/>
              </DialogContent>
            </Dialog>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}

