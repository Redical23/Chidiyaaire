"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

const AccountNav = ({
  customer,
}: {
  customer: {
    id: string
    email: string
    first_name?: string | null
    last_name?: string | null
  } | null
}) => {
  const route = usePathname()
  const params = useParams()
  const countryCode = params?.countryCode as string || ""

  const handleLogout = async () => {
    // Implement logout logic
    if (typeof window !== "undefined") {
      window.location.href = "/api/auth/signout"
    }
  }

  const navItems = [
    { href: "/account", label: "Overview" },
    { href: "/account/profile", label: "Profile" },
    { href: "/account/addresses", label: "Addresses" },
    { href: "/account/orders", label: "Orders" },
  ]

  return (
    <div>
      {/* Mobile Nav */}
      <div className="block sm:hidden" data-testid="mobile-account-nav">
        {route !== "/account" ? (
          <Link
            href="/account"
            className="flex items-center gap-x-2 text-sm py-2 text-slate-600 hover:text-slate-900"
            data-testid="account-main-link"
          >
            <span>←</span>
            <span>Account</span>
          </Link>
        ) : (
          <>
            <div className="text-xl font-semibold mb-4 px-4">
              Hello {customer?.first_name || "there"}
            </div>
            <div className="text-base">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-4 border-b border-gray-200 px-4 hover:bg-slate-50"
                      data-testid={`${item.label.toLowerCase()}-link`}
                    >
                      <span>{item.label}</span>
                      <span>→</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-4 w-full hover:bg-slate-50 text-left"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <span>Log out</span>
                    <span>→</span>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="hidden sm:block" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base font-semibold">Account</h3>
          </div>
          <div className="text-base">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              {navItems.map((item) => {
                const isActive = route === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`hover:text-slate-900 ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"}`}
                      data-testid={`${item.label.toLowerCase()}-link`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li className="text-slate-500">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover:text-slate-900"
                  data-testid="logout-button"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountNav
