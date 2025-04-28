import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { lazy, Suspense } from 'react';
import { LoadingState } from "@/components/shared/LoadingState";

// Lazy load pages for better performance
const VaultCatalog = lazy(() => import("./pages/VaultCatalog"));
const VaultDetail = lazy(() => import("./pages/VaultDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with basic configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // Disable retries to simplify debugging
    },
  },
});

// Fallback for lazy loaded components
const PageFallback = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center">
    <LoadingState type="spinner" className="scale-150" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <VaultCatalog />
              </MainLayout>
            } />
            {/* Routes for backward compatibility with old URLs */}
            <Route path="/vaults/orion-stable" element={<Navigate to="/vaults/cetus-sui" replace />} />
            <Route path="/vaults/nova-yield" element={<Navigate to="/vaults/deep-sui" replace />} />
            <Route path="/vaults/emerald-growth" element={<Navigate to="/vaults/sui-usdc" replace />} />
            {/* Regular vault detail route */}
            <Route path="/vaults/:vaultId" element={
              <MainLayout>
                <VaultDetail />
              </MainLayout>
            } />
            <Route path="/dashboard" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
