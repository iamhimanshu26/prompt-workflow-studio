export type NavItem = {
  href: string;
  labelKey: string;
  descriptionKey: string;
  highlight?: boolean;
};

export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", labelKey: "navDashboard", descriptionKey: "pageDescDashboard" },
  { href: "/playground", labelKey: "navPlayground", descriptionKey: "pageDescPlayground" },
  { href: "/optimizer", labelKey: "navOptimizer", descriptionKey: "pageDescOptimizer" },
  { href: "/library", labelKey: "navLibrary", descriptionKey: "pageDescLibrary" },
  { href: "/workflows", labelKey: "navWorkflows", descriptionKey: "pageDescWorkflows" },
  { href: "/any-idea", labelKey: "navAnyIdea", descriptionKey: "pageDescAnyIdea", highlight: true },
  { href: "/health", labelKey: "navHealth", descriptionKey: "pageDescHealth" },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/journey", labelKey: "navJourney", descriptionKey: "pageDescJourney" },
];

export function matchNavPath(pathname: string, href: string): boolean {
  if (href === "/health") return pathname === "/health";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findNavItem(pathname: string): NavItem | undefined {
  return [...PRIMARY_NAV, ...SECONDARY_NAV].find((item) => matchNavPath(pathname, item.href));
}
