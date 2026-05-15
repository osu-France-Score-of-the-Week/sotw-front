"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"

const navItems = [
  { href: "/", label: "Scores" },
  { href: "/players", label: "Players" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-foreground">
          <span className="inline-flex size-10 items-center justify-center rounded-md bg-primary text-base font-bold text-primary-foreground">
            S
          </span>
          <span className="hidden sm:inline text-xl">SOTW</span>
        </Link>

        <NavigationMenu viewport={false} className="max-w-none flex-1 justify-end">
          <NavigationMenuList className="gap-2">
            {navItems.map((item) => {
              const isActive = item.href === "/players" ? pathname.startsWith("/players") : pathname === item.href

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      data-active={isActive}
                      aria-current={isActive ? "page" : undefined}
                      className="px-3 py-2 text-xl"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
