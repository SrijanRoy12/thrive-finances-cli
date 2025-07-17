import { Dashboard } from "@/components/Dashboard";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
