import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import TaxReturnWizard from "./pages/client/TaxReturnWizard";
import TaxReturnsListPage from "./pages/client/TaxReturnsListPage";
import BillingPage from "./pages/client/BillingPage";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import VerificationPage from "./pages/employee/VerificationPage";
import TaxCalculationPage from "./pages/employee/TaxCalculation";

// FBR Pages
import FBRDashboard from "./pages/fbr/FBRDashboard";
import FBRReviewPage from "./pages/fbr/FBRReviewPage";

// Shared Pages
import TrackingPage from "./pages/shared/TrackingPage";
import InfoRequestsPage from "./pages/shared/InfoRequestsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/client/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Client Routes */}
      <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/tax-return" element={<ProtectedRoute><TaxReturnsListPage /></ProtectedRoute>} />
      <Route path="/client/tax-return/new" element={<ProtectedRoute><TaxReturnWizard /></ProtectedRoute>} />
      <Route path="/client/tax-return/:year" element={<ProtectedRoute><TaxReturnWizard /></ProtectedRoute>} />
      <Route path="/client/requests" element={<ProtectedRoute><InfoRequestsPage userType="client" /></ProtectedRoute>} />
      <Route path="/client/bills" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />

      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      {/* <Route path="/employee/clients" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} /> */}
      <Route path="/employee/verify" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
      <Route path="/employee/verify/:clientId" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
      <Route path="/employee/calculation" element={<ProtectedRoute><TaxCalculationPage /></ProtectedRoute>} />
      <Route path="/employee/requests" element={<ProtectedRoute><InfoRequestsPage userType="employee" /></ProtectedRoute>} />

      {/* FBR Routes */}
      <Route path="/fbr/dashboard" element={<ProtectedRoute><FBRDashboard /></ProtectedRoute>} />
      <Route path="/fbr/returns" element={<ProtectedRoute><FBRDashboard /></ProtectedRoute>} />
      <Route path="/fbr/review/:returnId" element={<ProtectedRoute><FBRReviewPage /></ProtectedRoute>} />
      <Route path="/fbr/decisions" element={<ProtectedRoute><FBRDashboard /></ProtectedRoute>} />

      {/* Shared Routes */}
      <Route path="/tracking" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
      <Route path="/tracking/:returnId" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
