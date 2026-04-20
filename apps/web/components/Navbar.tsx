"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { href: "/", label: "Scores" },
  { href: "/players", label: "Players" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="hidden sm:inline">SOTW</span>
        </Link>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = item.href === "/players" ? pathname.startsWith("/players") : pathname === item.href

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-full px-4", isActive && "shadow-sm")}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
