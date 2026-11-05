import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SiteLayout from './components/Layout';
import Home from './pages/Home';
import NewReport from './pages/NewReport';
import Track from './pages/Track';
import Privacy from './pages/Privacy';
import Faq from './pages/Faq';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PanelLayout from './pages/panel/PanelLayout';
import Dashboard from './pages/panel/Dashboard';
import ReportList from './pages/panel/ReportList';
import ReportDetail from './pages/panel/ReportDetail';
import AuditLogs from './pages/panel/AuditLogs';
import { Loading } from './components/UI';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Verificando sessão…" />;
  if (!user) return <Navigate to="/painel/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/denuncia" element={<NewReport />} />
            <Route path="/acompanhar" element={<Track />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/painel/login" element={<Login />} />
          <Route
            path="/painel"
            element={(
              <RequireAuth>
                <PanelLayout />
              </RequireAuth>
            )}
          >
            <Route index element={<Dashboard />} />
            <Route path="denuncias" element={<ReportList />} />
            <Route path="denuncias/:id" element={<ReportDetail />} />
            <Route path="auditoria" element={<AuditLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
