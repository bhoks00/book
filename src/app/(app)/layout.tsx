import { SidebarMain } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <SidebarMain >
              {children}

      </SidebarMain>
    
    </div>
  )
}