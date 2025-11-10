import type { Metadata } from "next";
import { Archivo, LXGW_WenKai_Mono_TC } from "next/font/google";
import "./globals.css";
import ProviderTanstack from "@/lib/tantack";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Archivo({
  variable: "--font-afacad-sans",
  subsets: ["latin"],
});

const geistMono = LXGW_WenKai_Mono_TC({
  weight:"400",
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Try: Book",
  description: "Learn Anywhare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}
    >      
        <ProviderTanstack>
            <main>
            {children}
            </main>
            <Toaster />
        </ProviderTanstack>
      </body>
    </html>
  );
}
