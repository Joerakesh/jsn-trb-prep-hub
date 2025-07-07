import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Tests from "./pages/Tests";
import YouTube from "./pages/YouTube";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Works from "./pages/Works";
import Samples from "./pages/Samples";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminTests from "./pages/admin/AdminTests";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminSamples from "./pages/admin/AdminSamples";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PaymentProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/materials/:id" element={<MaterialDetail />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/youtube" element={<YouTube />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/works" element={<Works />} />
                <Route path="/samples" element={<Samples />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/materials" element={<AdminMaterials />} />
                <Route path="/admin/tests" element={<AdminTests />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/samples" element={<AdminSamples />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PaymentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
