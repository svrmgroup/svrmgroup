import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import WhatsAppFab from "@/components/svrm/WhatsAppFab";
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
import Faq from "./pages/Faq.tsx";
import Contact from "./pages/Contact.tsx";
import Rentals from "./pages/Rentals.tsx";
import Security from "./pages/Security.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
            <Route path="/faq" element={<Faq />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppFab />
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
