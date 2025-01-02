"use client";

import {
  Box,
  LifeBuoy,
  MapPinIcon as MapPinHouse,
  MessageCircleCode,
  User2,
  UserCircle2,
  UserRoundCog,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Menu items remain the same
const accountItems = [
  {
    title: "Profile",
    url: "/settings",
    icon: UserRoundCog,
  },
  {
    title: "Orders",
    url: "/settings/orders",
    icon: Box,
  },
  {
    title: "Addresses",
    url: "/settings/addresses",
    icon: MapPinHouse,
  },
];

const supportItems = [
  {
    title: "Support",
    url: "/settings/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/settings/feedback",
    icon: MessageCircleCode,
  },
];

export default function SettingsSidebar() {
  const { data: session } = useSession();

  return (
    <TooltipProvider>
      <Sidebar className="my-20" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="py-7 hover:bg-transparent pointer-events-none">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-5 w-5 shrink-0 ">
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name ?? "User avatar"}
                    />
                    <AvatarFallback>
                      <UserCircle2 className="h-5 w-5" strokeWidth={1.5} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {session?.user?.name ?? "Welcome"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {session?.user?.email ?? ""}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your account settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="flex items-center gap-3"
                          >
                            <item.icon
                              strokeWidth={1.5}
                              className="w-5 h-5 shrink-0"
                            />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="flex items-center gap-3"
                          >
                            <item.icon
                              strokeWidth={1.5}
                              className="w-5 h-5 shrink-0"
                            />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
