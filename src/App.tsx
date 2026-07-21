import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import WhatsAppFab from "@/components/svrm/WhatsAppFab";
import WhatsAppClickTracker from "@/components/WhatsAppClickTracker";
import ScrollToTop from "@/components/ScrollToTop";
// Landing eagerly loaded — needed instantly for first paint.
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AdminAuthProvider } from "./hooks/useAdminAuth";

// ---- Public routes: lazy for below-the-fold / secondary pages -------------
const Travel = lazy(() => import("./pages/Travel.tsx"));
const Lifestyle = lazy(() => import("./pages/Lifestyle.tsx"));
const Stays = lazy(() => import("./pages/Stays.tsx"));
const Tours = lazy(() => import("./pages/Tours.tsx"));
const TourDetail = lazy(() => import("./pages/TourDetail.tsx"));
const TourBuilderPage = lazy(() => import("./pages/TourBuilderPage.tsx"));
const CustomExperiences = lazy(() => import("./pages/CustomExperiences.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Rentals = lazy(() => import("./pages/Rentals.tsx"));
const Security = lazy(() => import("./pages/Security.tsx"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const AirportTransfers = lazy(() => import("./pages/AirportTransfers.tsx"));

// ---- Admin console: fully lazy — never ships to public visitors -----------
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminCalendar = lazy(() => import("./pages/admin/AdminCalendar"));
const AdminWhatsApp = lazy(() => import("./pages/admin/AdminWhatsApp"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminManualBookings = lazy(() => import("./pages/admin/AdminManualBookings"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminExpenses = lazy(() => import("./pages/admin/AdminExpenses"));
const AdminPnL = lazy(() => import("./pages/admin/AdminPnL"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));
const AdminTasks = lazy(() => import("./pages/admin/AdminTasks"));
const AdminDirectory = lazy(() => import("./pages/admin/AdminDirectory"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminAssignments = lazy(() => import("./pages/admin/AdminAssignments"));
const AdminEmailTemplates = lazy(() => import("./pages/admin/AdminEmailTemplates"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminActivity = lazy(() => import("./pages/admin/AdminActivity"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminCMS = lazy(() => import("./pages/admin/AdminCMS"));
const AdminChangeRequests = lazy(() => import("./pages/admin/AdminChangeRequests"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));

const queryClient = new QueryClient();

// Minimal fallback — keeps layout stable, no flash.
const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden />
);

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
            <Suspense fallback={<RouteFallback />}>
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
                <Route path="/custom" element={<Navigate to="/experiences" replace />} />
                <Route path="/airport-transfers" element={<AirportTransfers />} />
                <Route path="/chauffeur" element={<Navigate to="/travel?cat=cars" replace />} />
                <Route path="/aquila-safari" element={<Navigate to="/tours/aquila-safari" replace />} />
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
            </Suspense>
            <WhatsAppFab />
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
