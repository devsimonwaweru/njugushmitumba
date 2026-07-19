import { Routes, Route } from 'react-router-dom'
import { useToast } from './hooks/useToast'
import Toast from './components/ui/Toast'
import MainLayout from './components/layouts/MainLayout'
import HomePage from './pages/HomePage'
import BaleDetailPage from './pages/BaleDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLayout from './components/layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBales from './pages/admin/AdminBales'
import AdminCategories from './pages/admin/AdminCategories'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminMessages from './pages/admin/AdminMessages'
import AdminSettings from './pages/admin/AdminSettings'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout addToast={addToast} />}>
          <Route path="/" element={<HomePage addToast={addToast} />} />
          <Route path="/bale/:slug" element={<BaleDetailPage addToast={addToast} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin addToast={addToast} />} />
        <Route path="/admin" element={<AdminLayout addToast={addToast} />}>
          <Route index element={<AdminDashboard addToast={addToast} />} />
          <Route path="bales" element={<AdminBales addToast={addToast} />} />
          <Route path="categories" element={<AdminCategories addToast={addToast} />} />
          <Route path="testimonials" element={<AdminTestimonials addToast={addToast} />} />
          <Route path="messages" element={<AdminMessages addToast={addToast} />} />
          <Route path="settings" element={<AdminSettings addToast={addToast} />} />
        </Route>
      </Routes>
    </>
  )
}