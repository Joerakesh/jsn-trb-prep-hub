
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentProvider } from "./contexts/PaymentContext";

// Page imports
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Tests from "./pages/Tests";
import YouTube from "./pages/YouTube";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Samples from "./pages/Samples";
import Works from "./pages/Works";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminTests from "./pages/admin/AdminTests";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminSamples from "./pages/admin/AdminSamples";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <PaymentProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/material/:id" element={<MaterialDetail />} />
                  <Route path="/tests" element={<Tests />} />
                  <Route path="/youtube" element={<YouTube />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/samples" element={<Samples />} />
                  <Route path="/works" element={<Works />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/materials" element={<AdminMaterials />} />
                  <Route path="/admin/tests" element={<AdminTests />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/videos" element={<AdminVideos />} />
                  <Route path="/admin/samples" element={<AdminSamples />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PaymentProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
