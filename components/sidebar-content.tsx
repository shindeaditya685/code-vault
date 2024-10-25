"use client";
import {
  BookMarkedIcon,
  Code,
  Folder,
  HomeIcon,
  MessageSquare,
} from "lucide-react";
import NavItem from "./nav-item";
import { usePathname } from "next/navigation";

const SidebarContent: React.FC = () => {
  const path = usePathname();

  const routes = [
    {
      id: 0,
      href: "/",
      label: "Home",
      icon: <HomeIcon className="mr-3" />,
    },
    {
      id: 1,
      href: "/code-snippets",
      subHref1: "/code-snippets/create",
      subHref2: "/code-snippets/edit/",
      label: "Code Snippets",
      icon: <Code className="mr-3" />,
    },
    {
      id: 2,
      href: "/projects",
      label: "Projects",
      icon: <Folder className="mr-3" />,
    },
    {
      id: 3,
      href: "/bookmarks",
      label: "Bookmarks",
      icon: <BookMarkedIcon className="mr-3" />,
    },
    {
      id: 4,
      href: "/ai-chat",
      label: "AI Chat",
      icon: <MessageSquare className="mr-3" />,
    },
  ];

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold">CodeVault</h1>
      </div>
      <nav className="mt-6">
        {routes.map((route) => (
          <NavItem
            key={route.id}
            href={route.href}
            icon={route.icon}
            text={route.label}
            active={
              route.href === path ||
              route.subHref1 === path ||
              path.startsWith(route.subHref2 as string)
            }
          />
        ))}
      </nav>
    </>
  );
};

export default SidebarContent;
