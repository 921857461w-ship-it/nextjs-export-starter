import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// locale 感知的 Link/redirect/usePathname/useRouter，组件内部一律用这里的 Link
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
