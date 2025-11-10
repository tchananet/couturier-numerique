"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

const breadcrumbNameMap: { [key: string]: string } = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/orders': 'Commandes',
  '/dashboard/clients': 'Clients',
  '/dashboard/patterns': 'Patrons',
  '/dashboard/profile': 'Profil',
};

function ResponsiveSidebarTrigger() {
    const { isMobile, openMobile } = useSidebar();
    if (!isMobile && openMobile) return null;
    return <SidebarTrigger />;
}

export default function DashboardHeader() {
  const pathname = usePathname();
  
  const pathnames = pathname.split('/').filter(x => x);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <ResponsiveSidebarTrigger />
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Accueil</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.slice(1).map((value, index) => {
              const to = `/${pathnames.slice(0, index + 2).join('/')}`;
              const isLast = index === pathnames.length - 2;
              const name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-headline">{name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={to}>{name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Add user menu or other actions here */}
    </header>
  );
}
