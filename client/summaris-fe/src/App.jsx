import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { UserSync } from "./components/common/UserSync";
import Layout from "./components/layout/Layout";
import { setNavigateFunction } from "./main.jsx";
import { LoginPage } from "./pages/LoginPage";
import { MyDocumentsPage } from "./pages/MyDocumentsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SummariesPage } from "./pages/SummariesPage";
import { HomePage } from "./pages/homePage";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <>
      <UserSync />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/summaries"
          element={
            <ProtectedRoute>
              <Layout>
                <SummariesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-docs"
          element={
            <ProtectedRoute>
              <Layout>
                <MyDocumentsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
