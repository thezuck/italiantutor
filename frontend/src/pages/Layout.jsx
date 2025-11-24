
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, BookOpen, LogOut, Menu, X } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, path: "Home" },
    { name: "Chat", icon: MessageSquare, path: "Chat" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-coral-50: #FFF5F0;
          --color-coral-100: #FFE0B2;
          --color-coral-200: #FFAB91;
          --color-coral-600: #FF7043;
          --color-coral-700: #F4511E;
        }
        .bg-coral-50 { background-color: var(--color-coral-50); }
        .bg-coral-100 { background-color: var(--color-coral-100); }
        .bg-coral-200 { background-color: var(--color-coral-200); }
        .text-coral-600 { color: var(--color-coral-600); }
        .text-coral-700 { color: var(--color-coral-700); }
        .border-coral-100 { border-color: var(--color-coral-100); }
        .border-coral-200 { border-color: var(--color-coral-200); }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                ItalianLearn
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link key={item.path} to={createPageUrl(item.path)}>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 font-medium ${
                          isActive
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
                {user && (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-50 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
