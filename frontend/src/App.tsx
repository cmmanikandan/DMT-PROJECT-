import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatasetProvider } from './context/DatasetContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Dataset } from './pages/Dataset';
import { Preprocessing } from './pages/Preprocessing';
import { SalesAnalysis } from './pages/SalesAnalysis';
import { SalesPrediction } from './pages/SalesPrediction';
import { ProductDemand } from './pages/ProductDemand';
import { CustomerSegmentation } from './pages/CustomerSegmentation';
import { MarketBasket } from './pages/MarketBasket';
import { ProductPerformance } from './pages/ProductPerformance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { InventoryAlerts } from './pages/InventoryAlerts';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ErrorBoundary fallbackTitle="Dashboard Overview Error">
                <Dashboard />
              </ErrorBoundary>
            }
          />
          <Route
            path="dataset"
            element={
              <ErrorBoundary fallbackTitle="Dataset Management Error">
                <Dataset />
              </ErrorBoundary>
            }
          />
          <Route
            path="preprocessing"
            element={
              <ErrorBoundary fallbackTitle="Data Preprocessing Error">
                <Preprocessing />
              </ErrorBoundary>
            }
          />
          <Route
            path="sales-analysis"
            element={
              <ErrorBoundary fallbackTitle="Sales Analysis Error">
                <SalesAnalysis />
              </ErrorBoundary>
            }
          />
          <Route
            path="prediction"
            element={
              <ErrorBoundary fallbackTitle="Sales Prediction Error">
                <SalesPrediction />
              </ErrorBoundary>
            }
          />
          <Route
            path="product-analysis"
            element={
              <ErrorBoundary fallbackTitle="Product Analysis Error">
                <ProductDemand />
              </ErrorBoundary>
            }
          />
          <Route
            path="product-demand"
            element={
              <ErrorBoundary fallbackTitle="Product Demand Error">
                <ProductDemand />
              </ErrorBoundary>
            }
          />
          <Route
            path="product-intelligence"
            element={
              <ErrorBoundary fallbackTitle="Product Analysis Error">
                <ProductDemand />
              </ErrorBoundary>
            }
          />
          <Route
            path="inventory-alerts"
            element={
              <ErrorBoundary fallbackTitle="Inventory Alerts Error">
                <InventoryAlerts />
              </ErrorBoundary>
            }
          />
          <Route
            path="customer-segmentation"
            element={
              <ErrorBoundary fallbackTitle="Customer Segmentation Error">
                <CustomerSegmentation />
              </ErrorBoundary>
            }
          />
          <Route
            path="market-basket"
            element={
              <ErrorBoundary fallbackTitle="Market Basket Analysis Error">
                <MarketBasket />
              </ErrorBoundary>
            }
          />
          <Route
            path="product-performance"
            element={
              <ErrorBoundary fallbackTitle="Product Performance Error">
                <ProductDemand />
              </ErrorBoundary>
            }
          />
          <Route
            path="reports"
            element={
              <ErrorBoundary fallbackTitle="Reports Generation Error">
                <Reports />
              </ErrorBoundary>
            }
          />
          <Route
            path="settings"
            element={
              <ErrorBoundary fallbackTitle="Settings View Error">
                <Settings />
              </ErrorBoundary>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DatasetProvider>
          <AppContent />
        </DatasetProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
