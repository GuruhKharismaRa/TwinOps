import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  ClipboardList,
  Truck,
  Users,
  Shield
} from "lucide-react";

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
    permission: "dashboard.view",
    section: "main"
  },

  {
    title: "Warehouse",
    icon: Warehouse,
    url: "/warehouse",
    permission: "warehouse.view",
    section: "main"
  },

  {
    title: "Inventory",
    icon: Boxes,
    url: "/inventory",
    permission: "inventory.view",
    section: "main"
  },

  {
    title: "Task",
    icon: ClipboardList,
    url: "/task",
    permission: "task.view",
    section: "main"
  },

  {
    title: "Forklift",
    icon: Truck,
    url: "/forklift",
    permission: "forklift.view",
    section: "main"
  },

  {
    title: "Users",
    icon: Users,
    url: "/users",
    permission: "user.manage",
    section: "system"
  },

  {
    title: "Roles",
    icon: Shield,
    url: "/roles",
    permission: "role.manage",
    section: "system"
  }
];