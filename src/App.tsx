
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import Index from "./pages/Index";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Samples from "./pages/Samples";
import Tests from "./pages/Tests";
import Works from "./pages/Works";
import YouTube from "./pages/YouTube";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSamples from "./pages/admin/AdminSamples";
import AdminTests from "./pages/admin/AdminTests";
import AdminVideos from "./pages/admin/AdminVideos";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AuthProvider>
            <PaymentProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/materials/:id" element={<MaterialDetail />} />
                  <Route path="/material/:id" element={<MaterialDetail />} />
                  <Route path="/samples" element={<Samples />} />
                  <Route path="/tests" element={<Tests />} />
                  <Route path="/works" element={<Works />} />
                  <Route path="/youtube" element={<YouTube />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/materials" element={<AdminMaterials />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/samples" element={<AdminSamples />} />
                  <Route path="/admin/tests" element={<AdminTests />} />
                  <Route path="/admin/videos" element={<AdminVideos />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </PaymentProvider>
          </AuthProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
