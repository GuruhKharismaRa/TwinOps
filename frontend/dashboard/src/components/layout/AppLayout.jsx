import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  LayoutDashboard,
  Folder,
  BarChart3,
  Users,
  Database,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  CircleHelp,
  ChevronRight,
} from "lucide-react"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext.jsx"
import { MENU_ITEMS } from "@/config/menuConfig.js"
import CommandPalette from "@/components/search/CommandPalette";
import useCommandPalette from "@/hooks/useCommandPalette";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useEffect, useRef } from "react";

// const allowedMenus =
//   MENU_ITEMS.filter(menu =>
//     permissions.includes(
//       menu.permission
//     )
//   );

// const mainMenus = [
//   {
//     title: "Dashboard",
//     icon: LayoutDashboard,
//     url: "/",
//   },
//   {
//     title: "Lifecycle",
//     icon: FileText,
//     url: "/lifecycle",
//   },
//   {
//     title: "Analytics",
//     icon: BarChart3,
//     url: "/analytics",
//   },
//   {
//     title: "Projects",
//     icon: Folder,
//     url: "/projects",
//   },
//   {
//     title: "Team",
//     icon: Users,
//     url: "/team",
//   },
// ]

const documentMenus = [
  {
    title: "Data Library",
    icon: Database,
    url: "/library",
  },
  {
    title: "Reports",
    icon: FileText,
    url: "/reports",
  },
  {
    title: "Word Assistant",
    icon: FileText,
    url: "/assistant",
  },
]

const systemMenus = [
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
  {
    title: "Get Help",
    icon: CircleHelp,
    url: "/help",
  },
  {
    title: "Search",
    icon: Search,
    url: "/search",
  },
]


export default function AppLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, permissions } = useAuth()
  
  useEffect(() => {
  if (!user?.user_id) {
    return;
  }

  const warehouseId =
    user?.warehouses?.[0] || "WH001";

  const ws = new WebSocket(
    `ws://localhost:8002/ws/${warehouseId}/${user.user_id}`
  );

  ws.onopen = () => {

    console.log(
      "WEBSOCKET CONNECTED",
      user.user_id
    );

  };

  ws.onmessage = event => {

    const data =
      JSON.parse(
        event.data
      );

    console.log(
      "WS EVENT",
      data
    );

    window.dispatchEvent(
      new CustomEvent(
        "notification-created",
        {
          detail: data
        }
      )
    );

  };

  ws.onerror = error => {

    console.error(
      "WS ERROR",
      error
    );

  };

  ws.onclose = () => {
    console.log(
      "WS CLOSED"
    );
  };

  wsRef.current = ws;

  return () => {
    ws.close();
  };

}, [user]);
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/login")
  }
  const { open, setOpen } = useCommandPalette();
  const allowedMenus =
    MENU_ITEMS.filter(menu =>
      permissions.includes(
        menu.permission
      )
    );
  const wsRef = useRef(null);
  console.log("PERMISSIONS",permissions)
  console.log("User", user)

  const extraPages = {
  "/profile": "User Profile",
  "/notification-settings": "Notification Settings",
  "/change-password": "Change Password",
  "/audit-logs": "Audit Logs"
};

  const currentMenu =
    MENU_ITEMS.find(
      menu =>
        menu.url === location.pathname
    );

  const pageTitle = currentMenu?.title || extraPages[location.pathname] || "TwinOps";
  const pageSection = currentMenu?.section || "settings";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f3f1f7]">
        {/* SIDEBAR */}
        <Sidebar
        side="left"
        variant="sidebar"
          collapsible="offcanvas"
          className="
          border-r-0
            bg-[#f8f7fa]
          "
        >
          {/* HEADER */}
          <SidebarHeader className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d8d2e4]
                "
              >
                <div className="h-2 w-2 rounded-full bg-[#8a79ab]" />
              </div>

              <h1
                className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.02em]
                  text-[#2f2d41]
                "
              >
                Acme Inc.
              </h1>
            </div>
          </SidebarHeader>

          {/* CONTENT */}
          <SidebarContent className="px-3">
            {/* QUICK CREATE */}
            {/* <button
              className="
                mb-4
                flex
                h-9
                w-full
                items-center
                gap-2
                rounded-lg
                bg-[#8a79ab]
                px-4

                text-sm
                font-medium
                text-white

                transition-all
                hover:bg-[#7b6a9b]
              "
            >
              <Plus className="h-4 w-4" />
              Quick Create
            </button> */}

            {/* MAIN MENU */}
            <SidebarMenu className="space-y-1">
              {allowedMenus.map((menu) => {
                const Icon = menu.icon
                const active = location.pathname === menu.url

                return (
                  <SidebarMenuItem key={menu.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`
                        h-5
                        w-auto
                        rounded-lg
                        border-0
                        px-3
                        text-[14px]
                        shadow-none
                        ring-0

                        transition-all

                        ${
                          active
                            ? "bg-[#ead7e1] text-[#4b2e36]"
                            : "text-[#4e4a5c] hover:bg-[#f3eff7] hover:text-[#2f2d41]"
                        }
                      `}
                    >
                      <Link
                        to={menu.url}
                        className="
                          flex
                          items-center
                          gap-3
                          no-underline
                        "
                      >
                        <Icon className="h-4 w-4 shrink-0" />

                        <span>{menu.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>

            {/* DOCUMENTS */}
            <div className="mt-8">
              <p
                className="
                  mb-3
                  px-3

                  text-[13px]
                  font-medium

                  text-[#8f89a0]
                "
              >
                {pageTitle}
              </p>
              

              <SidebarMenu className="space-y-1">
                {documentMenus.map((menu) => {
                  const Icon = menu.icon

                  return (
                    <SidebarMenuItem key={menu.title}>
                      <SidebarMenuButton
                        asChild
                        className="
                          h-9
                          rounded-lg
                          border-0
                          px-3

                          text-[14px]
                          font-normal

                          text-[#4e4a5c]

                          shadow-none
                          ring-0

                          transition-all

                          hover:bg-[#f3eff7]
                          hover:text-[#2f2d41]
                        "
                      >
                        <Link
                          to={menu.url}
                          className="
                            flex
                            items-center
                            gap-3
                            no-underline
                          "
                        >
                          <Icon className="h-4 w-4 shrink-0" />

                          <span>{menu.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </div>

            {/* SYSTEM */}
            <div className="mt-8">
              <SidebarMenu className="space-y-1">
                {systemMenus.map((menu) => {
                  const Icon = menu.icon

                  return (
                    <SidebarMenuItem key={menu.title}>
                      <SidebarMenuButton
                        asChild
                        className="
                          h-9
                          rounded-lg
                          border-0
                          px-3

                          text-[14px]
                          font-normal

                          text-[#4e4a5c]

                          shadow-none
                          ring-0

                          transition-all

                          hover:bg-[#f3eff7]
                          hover:text-[#2f2d41]
                        "
                      >
                        <Link
                          to={menu.url}
                          className="
                            flex
                            items-center
                            gap-3
                            no-underline
                          "
                        >
                          <Icon className="h-4 w-4 shrink-0" />

                          <span>{menu.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>

          {/* FOOTER */}
          <SidebarFooter className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#ece9f1]

                    text-xs
                    font-medium
                    text-[#4b4660]
                  "
                >
                   {user?.full_name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.substring(0, 2) || "GU"}
                </div>

                <div>
                  <p className="text-sm font-medium text-[#2f2d41]">
                     {user?.full_name || "Loading..."}
                  </p>

                  <p className="text-xs text-[#8f89a0]">
                     {user?.role_name || user?.username}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg

                      text-[#6b657c]

                      transition-all

                      hover:bg-[#f1edf7]
                    "
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                  onClick={() => {
                    navigate("/profile");
                    if (isMobile) {
                      setOpenMobile(false);
                    }
                  }
                  }>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:bg-red-50">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN */}
        <main className="flex flex-1 flex-col bg-[#fcfbfd]">

          {/* CONTENT */}
          <div className="flex-1 bg-[#f3f1f7] p-2  shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.08)] ">
          {/* TOPBAR */}
          <header
          className="
            flex
            h-14
            items-center
            rounded-t-[10px]
            border-b
            border-[#e7e2ee]
            bg-[#fcfbfd]
            px-5
          "
        >

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <SidebarTrigger
              className="
                h-8
                w-8
                rounded-lg
                text-[#5f586b]
                transition-all
                hover:bg-[#f1edf7]
              "
            />

            <ChevronRight
              className="
                h-4
                w-4
                text-[#b7b0c5]
              "
            />

            <span
              className="
                text-xs
                text-[#8f89a0]
                capitalize
              "
            >
              {pageSection}
            </span>

            <ChevronRight
              className="
                h-4
                w-4
                text-[#b7b0c5]
              "
            />
            <h1
              className="
                text-[15px]
                font-medium
                text-[#3d3c4f]
              "
            >
               {pageTitle}
            </h1>

          </div>

          {/* RIGHT */}
          <div
            className="
              ml-auto
              flex
              items-center
              gap-3
            "
          >

            <CommandPalette />

            <NotificationBell />

            <div
              className="
                h-8
                w-px
                bg-[#e7e2ee]
              "
            />

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#ece9f1]
                  text-xs
                  font-medium
                  text-[#4b4660]
                "
              >
                {user?.full_name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("")
                  ?.substring(0, 2) || "GU"}
              </div>

              <div className="hidden md:block">

                <p
                  className="
                    text-sm
                    font-medium
                    text-[#2f2d41]
                  "
                >
                  {user?.full_name}
                </p>

                <p
                  className="
                    text-xs
                    text-[#8f89a0]
                  "
                >
                  {user?.role_name}
                </p>

              </div>

            </div>

          </div>

        </header>
            <div
              className="
                min-h-full

                bg-[#fcfbfd]
              "
            >
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}