import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ParticleBackground from './components/ui/ParticleBackground';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ProjectsPage from './components/pages/ProjectsPage';
import { BlogListPage, BlogPostPage } from './components/pages/BlogPage';
import ContactPage from './components/pages/ContactPage';
import ScannerPage from './components/pages/ScannerPage';
import AttackMapPage from './components/pages/AttackMapPage';
import CveExplorerPage from './components/pages/CveExplorerPage';
import ThreatsPage from './components/pages/ThreatsPage';
import SocDashboardPage from './components/pages/SocDashboardPage';
import AttackLabPage from './components/pages/AttackLabPage';
import SecurityDashboardPage from './components/pages/SecurityDashboardPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './components/auth/AuthPages';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 text-white relative">
        <ParticleBackground />
        <div className="relative z-10">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/attack-map" element={<AttackMapPage />} />
              <Route path="/cve" element={<CveExplorerPage />} />
              <Route path="/threats" element={<ThreatsPage />} />
              <Route path="/soc" element={<SocDashboardPage />} />
              <Route path="/attack-lab" element={<AttackLabPage />} />
              <Route path="/security" element={<SecurityDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
