import { Link, NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
} from "lucide-react"
import toast from "react-hot-toast"

const navLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  ].join(" ")

export default function DashboardLayout() {
  const { user, logout } = useAuth()

  const onLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <label
              htmlFor="app-sidebar-toggle"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border/50 hover:bg-accent transition-colors lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </label>
            <Link
              to={user?.role === "admin" ? "/admin/dashboard" : "/profile"}
              className="flex items-center"
            >
              <img 
                src="/purple-merit-logo.png" 
                alt="Purple Merit" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <div className="text-sm font-semibold text-foreground">{user?.fullName}</div>
              <div className="text-xs font-medium text-muted-foreground capitalize">{user?.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <input id="app-sidebar-toggle" type="checkbox" className="peer hidden" />

        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 w-72 -translate-x-full border-r bg-white p-6 shadow-xl transition-transform peer-checked:translate-x-0 lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-sm">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="text-sm font-semibold">Navigation</div>
            <label
              htmlFor="app-sidebar-toggle"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border hover:bg-accent"
              aria-label="Close navigation"
            >
              <Menu className="h-4 w-4" />
            </label>
          </div>

          <nav className="space-y-1.5">
            {user?.role === "admin" && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </NavLink>
            )}
            <NavLink to="/profile" className={navLinkClass}>
              <User className="h-5 w-5" />
              Account Settings
            </NavLink>
          </nav>

          <Separator className="my-6" />

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Signed in as</div>
            <div className="truncate">{user?.email}</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
