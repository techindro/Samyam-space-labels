import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ParallelWebBg from "@/components/ParallelWebBg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
      <div className="text-center relative z-10 glass-card rounded-2xl p-12">
        <h1 className="mb-4 text-6xl font-bold font-display text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-cosmic-purple underline hover:text-cosmic-purple/80 font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
