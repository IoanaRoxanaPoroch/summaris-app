import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Se încarcă...</p>
      </div>
    );
  }

  // Dacă utilizatorul nu este autentificat, redirecționează la login (pagina principală)
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Dacă utilizatorul este autentificat, afișează conținutul protejat
  return children;
}
