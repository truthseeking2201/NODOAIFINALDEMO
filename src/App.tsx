import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { lazy, Suspense } from 'react';
import { LanguageProvider } from "./contexts/LanguageContext";

// Lazy load pages for better performance with improved loading reliability
const VaultCatalog = lazy(() => import("./pages/VaultCatalog").catch(e => {
  console.error("Error loading VaultCatalog:", e);
  return { default: () => <PageFallback /> };
}));
const VaultDetail = lazy(() => import("./pages/EnhancedVaultDetail").catch(e => {
  console.error("Error loading EnhancedVaultDetail:", e);
  return { default: () => <PageFallback /> };
}));
const Dashboard = lazy(() =>
  // Load Dashboard component immediately without delay
  import("./pages/Dashboard")
    .catch(e => {
      console.error("Error loading Dashboard:", e);
      return { default: () => <PageFallback /> };
    })
);
const NotFound = lazy(() => import("./pages/NotFound").catch(e => {
  console.error("Error loading NotFound:", e);
  return { default: () => <PageFallback /> };
}));

// Create query client that still loads data but doesn't show loading states
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // Disable retries
      staleTime: 60000, // Cache for 1 minute
      gcTime: 120000, // Keep in cache for 2 minutes
    },
  },
});

// Replace loading state with mock data for demo - no loading screen needed
const PageFallback = () => null;

// Preload Dashboard component immediately when app loads
(() => {
  // This immediate invocation will preload the Dashboard in the background
  import("./pages/Dashboard")
    .catch(err => console.error("Failed to preload Dashboard on init:", err));
})();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Suspense fallback={<PageFallback />}>
                  <VaultCatalog />
                </Suspense>
              </MainLayout>
            } />

          {/* Routes for backward compatibility with old URLs */}
          <Route path="/vaults/orion-stable" element={<Navigate to="/vaults/cetus-sui" replace />} />
          <Route path="/vaults/nova-yield" element={<Navigate to="/vaults/deep-sui" replace />} />
          <Route path="/vaults/emerald-growth" element={<Navigate to="/vaults/sui-usdc" replace />} />

          {/* Regular vault detail route */}
          <Route path="/vaults/:vaultId" element={
            <MainLayout>
              <Suspense fallback={<PageFallback />}>
                <VaultDetail />
              </Suspense>
            </MainLayout>
          } />

          {/* Dashboard route with dedicated Suspense */}
          <Route path="/dashboard" element={
            <MainLayout>
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            </MainLayout>
          } />

          <Route path="*" element={
            <Suspense fallback={<PageFallback />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
