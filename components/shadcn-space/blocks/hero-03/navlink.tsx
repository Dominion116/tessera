import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavLinkItem = {
  title: string;
  href: string;
  isActive?: boolean;
};

export interface NavLinkProps {
  item: NavLinkItem;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, onClick }) => {
  const { title, href, isActive } = item;

  return (
    <li
      className={cn(
        "group flex items-center transition-all duration-500 ease-in-out w-fit",
        isActive ? "gap-3" : "gap-0 hover:gap-3 focus-within:gap-3"
      )}
    >
      {/* The mark is decoration; it only frames the focused link. */}
      <div
        aria-hidden="true"
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isActive
            ? "max-w-6 opacity-100"
            : "max-w-0 opacity-0 group-hover:max-w-6 group-hover:opacity-100 group-focus-within:max-w-6 group-focus-within:opacity-100"
        )}
      >
        <img
          src="/tessera-mark.svg"
          alt=""
          height={20}
          width={20}
          className="animate-spin"
        />
      </div>
      <Link
        href={href}
        onClick={onClick}
        className="rounded-md text-foreground text-2xl sm:text-4xl sm:leading-10 leading-8 font-semibold focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {title}
      </Link>
    </li>
  );
};

export default NavLink;
