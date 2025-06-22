
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, User, LogOut, Settings, ShoppingCart, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "Study Materials", path: "/materials" },
    { name: "Online Tests", path: "/tests" },
    { name: "YouTube", path: "/youtube" },
    { name: "About", path: "/about" },
    { name: "Our Works", path: "/works" },
    { name: "Contact", path: "/contact" },
  ];

  const userNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Orders", path: "/orders" },
    { name: "Study Materials", path: "/materials" },
    { name: "Online Tests", path: "/tests" },
    { name: "YouTube", path: "/youtube" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = user ? userNavItems : publicNavItems;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">JSN Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline" size="sm" className="relative">
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-blue-600 text-blue-600">
                      <User className="h-4 w-4 mr-1" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="text-red-600 text-left py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-fit border-blue-600 text-blue-600 hover:bg-blue-50 mt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
