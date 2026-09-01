import { ToastProvider } from './components/common/Toast';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="page-header__subtitle">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <main className="app-shell">
      <DashboardPage />
    </main>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
