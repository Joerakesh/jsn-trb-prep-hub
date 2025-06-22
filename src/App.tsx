
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/material/:id" element={<MaterialDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/works" element={<Works />} />
                <Route path="/youtube" element={<YouTube />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/materials" element={<AdminMaterials />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/samples" element={<AdminSamples />} />
                <Route path="/admin/tests" element={<AdminTests />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
