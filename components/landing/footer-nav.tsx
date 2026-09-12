import Link from "next/link";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "All POAPs", href: "/app/explore" },
      { label: "My collection", href: "/app/collection" },
      { label: "Dashboard", href: "/app" },
    ],
  },
  {
    heading: "Create",
    links: [
      { label: "Register an event", href: "/app/create" },
      { label: "POAPs I created", href: "/app/created" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Questions", href: "#faq" },
    ],
  },
];

const FooterNav = () => {
  return (
    <nav aria-label="Footer" className="grid grid-cols-3 gap-x-4 sm:gap-x-10">
      {COLUMNS.map((column) => (
        <div key={column.heading} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/90">
            {column.heading}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-teal-100/60 transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default FooterNav;
