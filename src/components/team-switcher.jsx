"use client"
import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="flex aspect-square font-bold size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            P
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-2xl text-orange-500">
              Phoenix<span className="text-red-600">Shop</span>
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
