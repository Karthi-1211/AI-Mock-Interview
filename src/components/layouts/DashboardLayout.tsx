import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import MainNavbar from "./MainNavbar";
import MainFooter from "./MainFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Interviews",
      href: "/home",
      icon: Calendar,
    },
    {
      name: "Results",
      href: "/results",
      icon: FileText,
    },
    {
      name: "Settings",
      href: "/",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />

      <div className="flex flex-1 pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <Link to="/dashboard" className="flex items-center">
                  <Logo className="h-8 w-auto" />
                  <span className="ml-2 text-xl font-bold text-interview-primary">VirtuHire</span>
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-interview-background hover:text-interview-primary transition-colors",
                      location.pathname === item.href
                        ? "bg-interview-background text-interview-primary"
                        : "text-gray-600"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        location.pathname === item.href
                          ? "text-interview-primary"
                          : "text-gray-400 group-hover:text-interview-primary"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity md:hidden",
            sidebarOpen ? "opacity-100 ease-out duration-300" : "opacity-0 ease-in duration-200 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={cn(
            "fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 transform transition md:hidden",
            sidebarOpen ? "translate-x-0 ease-out duration-300" : "-translate-x-full ease-in duration-200"
          )}
        >
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <Link to="/dashboard" className="flex items-center">
                <Logo className="h-8 w-auto" />
                <span className="ml-2 font-bold text-interview-primary">StellarMock</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-interview-background hover:text-interview-primary transition-colors",
                    location.pathname === item.href
                      ? "bg-interview-background text-interview-primary"
                      : "text-gray-600"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      location.pathname === item.href
                        ? "text-interview-primary"
                        : "text-gray-400 group-hover:text-interview-primary"
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-16 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
      
      <MainFooter />
    </div>
  );
};

export default DashboardLayout;
