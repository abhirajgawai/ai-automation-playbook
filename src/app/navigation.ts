export type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

export type NavGroup = {
  label: "Learn" | "Decide" | "Operate";
  items: NavItem[];
};

export const navigationGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { to: "/explore", label: "Explore" },
      { to: "/bookmarks", label: "Bookmarks" },
      { to: "/glossary", label: "Glossary" },
      { to: "/sources", label: "Sources & changes" },
    ],
  },
  {
    label: "Decide",
    items: [
      { to: "/start", label: "Start a problem" },
      { to: "/review", label: "Review a design" },
      { to: "/compare", label: "Compare" },
    ],
  },
  {
    label: "Operate",
    items: [
      { to: "/troubleshoot", label: "Troubleshoot" },
      { to: "/projects", label: "My projects" },
      { to: "/settings", label: "Settings" },
    ],
  },
];
