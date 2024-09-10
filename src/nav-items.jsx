import { HomeIcon, BulbIcon, UserIcon, SettingsIcon } from "lucide-react";
import Index from "./pages/Index.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Ideas",
    to: "/ideas",
    icon: <BulbIcon className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual page when created
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual page when created
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Index />, // Placeholder, replace with actual page when created
  },
];