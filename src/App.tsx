import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Works from "./pages/Works";
import YouTube from "./pages/YouTube";
import Tests from "./pages/Tests";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSamples from "./pages/admin/AdminSamples";
import AdminTests from "./pages/admin/AdminTests";
import AdminVideos from "./pages/admin/AdminVideos";
import NotFound from "./pages/NotFound";
import Samples from "./pages/Samples";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/materials/:id" element={<MaterialDetail />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/youtube" element={<YouTube />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/samples" element={<Samples />} />
                <Route path="/works" element={<Works />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/materials" element={<AdminMaterials />} />
                <Route path="/admin/tests" element={<AdminTests />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/samples" element={<AdminSamples />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
