import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import WhatsAppFab from "@/components/svrm/WhatsAppFab";
import WhatsAppClickTracker from "@/components/WhatsAppClickTracker";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Travel from "./pages/Travel.tsx";
import Lifestyle from "./pages/Lifestyle.tsx";
import Stays from "./pages/Stays.tsx";
import Tours from "./pages/Tours.tsx";
import TourDetail from "./pages/TourDetail.tsx";
import TourBuilderPage from "./pages/TourBuilderPage.tsx";
import CustomExperiences from "./pages/CustomExperiences.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Contact from "./pages/Contact.tsx";
import Rentals from "./pages/Rentals.tsx";
import Security from "./pages/Security.tsx";
import NotFound from "./pages/NotFound.tsx";
import ClientPortal from "./pages/ClientPortal";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminManualBookings from "./pages/admin/AdminManualBookings";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminExpenses from "./pages/admin/AdminExpenses";
import AdminPnL from "./pages/admin/AdminPnL";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminDirectory from "./pages/admin/AdminDirectory";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminEmailTemplates from "./pages/admin/AdminEmailTemplates";
import AdminClients from "./pages/admin/AdminClients";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminChangeRequests from "./pages/admin/AdminChangeRequests";
import AdminMedia from "./pages/admin/AdminMedia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminAuthProvider>
            <ScrollToTop />
            <WhatsAppClickTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/security" element={<Security />} />
              <Route path="/lifestyle" element={<Lifestyle />} />
              <Route path="/stays" element={<Stays />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tours/builder" element={<TourBuilderPage />} />
              <Route path="/tours/:slug" element={<TourDetail />} />
              <Route path="/experiences" element={<CustomExperiences />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Navigate to="/contact#faq" replace />} />
              <Route path="/booking/:token" element={<ClientPortal />} />
              <Route path="/portal/:token" element={<ClientPortal />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminAnalytics />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="manual" element={<AdminManualBookings />} />
                <Route path="change-requests" element={<AdminChangeRequests />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="expenses" element={<AdminExpenses />} />
                <Route path="pnl" element={<AdminPnL />} />
                <Route path="suppliers" element={<AdminSuppliers />} />
                <Route path="tasks" element={<AdminTasks />} />
                <Route path="directory" element={<AdminDirectory />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="whatsapp" element={<AdminWhatsApp />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="email-templates" element={<AdminEmailTemplates />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppFab />
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
