"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Buy", href: "#" },
    { label: "Rent", href: "#" },
    { label: "Sell", href: "#" },
    { label: "Get a mortgage", href: "#" },
    { label: "Find an agent", href: "#" },
  ]

  return (
    <header className="border-b border-border bg-white sticky top-0 z-40">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-2xl">Z</div>
            <span className="font-semibold hidden sm:inline text-lg"></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary font-medium text-sm transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
              Manage rentals
            </button>
            <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
              Advertise
            </button>
            <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
              Get help
            </button>
            <button className="text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
              Sign in
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 border-t border-border pt-4 space-y-3">

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-foreground hover:text-primary font-medium text-sm py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <hr className="border-border" />

            <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
              Manage rentals
            </button>
            <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
              Advertise
            </button>
            <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
              Get help
            </button>
            <button className="w-full text-left text-primary font-semibold text-sm py-2 hover:opacity-80 transition-opacity">
              Sign in
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}
