
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { BookOpen, Menu, User, LogOut, Settings, FileText, Play, Youtube, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: "Home", path: "/", icon: null },
    { name: "Study Materials", path: "/materials", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Online Tests", path: "/tests", icon: <Play className="h-4 w-4" /> },
    { name: "YouTube", path: "/youtube", icon: <Youtube className="h-4 w-4" /> },
    { name: "About", path: "/about", icon: null },
    { name: "Contact", path: "/contact", icon: null },
  ];

  const adminItems = [
    { name: "Dashboard", path: "/admin", icon: <Settings className="h-4 w-4" /> },
    { name: "Materials", path: "/admin/materials", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Tests", path: "/admin/tests", icon: <Play className="h-4 w-4" /> },
    { name: "Orders", path: "/admin/orders", icon: <FileText className="h-4 w-4" /> },
    { name: "Videos", path: "/admin/videos", icon: <Youtube className="h-4 w-4" /> },
  ];

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  // Scroll to top when route changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">JSN English Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(item.path)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-white border shadow-lg z-[60]"
                      sideOffset={5}
                    >
                      {adminItems.map((item, index) => (
                        <div key={item.name}>
                          {index === 1 && <DropdownMenuSeparator />}
                          <DropdownMenuItem asChild>
                            <Link
                              to={item.path}
                              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full ${
                                isActive(item.path)
                                  ? "bg-red-100 text-red-600 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {item.icon}
                              {item.name}
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Admin Items */}
                {user && isAdmin && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-medium text-red-600 px-4 mb-2">Admin Panel</p>
                      {adminItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            isActive(item.path)
                              ? "bg-red-100 text-red-600"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Mobile Auth Section */}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
