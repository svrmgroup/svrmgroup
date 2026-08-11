import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo
        title="Page not found (404) | SVRM Group"
        description="This page doesn't exist. Return to SVRM Group for luxury chauffeur, tours, stays, rentals and concierge in Cape Town."
        path={location.pathname}
      />
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404 — page not found</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            The page you're looking for has moved or no longer exists.
          </p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
