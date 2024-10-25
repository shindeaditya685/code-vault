import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, active }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center px-4 py-2 transition-colors",
      active ? "bg-green-500 text-black" : "hover:bg-green-500 hover:text-black"
    )}
  >
    {icon}
    {text}
  </Link>
);

export default NavItem;
