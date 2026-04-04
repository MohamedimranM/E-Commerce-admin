import {
  LayoutDashboard,
  Users,
  Package,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  segment: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        segment: "dashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Users",
        href: "/dashboard/users",
        icon: Users,
        segment: "users",
      },
      {
        label: "Products",
        href: "/dashboard/products",
        icon: Package,
        segment: "products",
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
        icon: Star,
        segment: "reviews",
      },
    ],
  },
];
