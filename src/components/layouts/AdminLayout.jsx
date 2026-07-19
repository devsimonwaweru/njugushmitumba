import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, Grid3X3, Star, Mail, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/bales', icon: Package, label: 'Bales' },
  { to: '/admin/categories', icon: Grid3X3, label: 'Categories' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

const mobileLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/admin/bales', icon: Package, label: 'Bales' },
  { to: '/admin/messages', icon: Mail, label: 'Msgs' },
  { to: '/admin/settings', icon: Settings, label: 'More' },
]

function SidebarContent({ onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
    onClose?.()
  }

  return (
    <>
      <div className="p-5 border-b border-navy-400">
        <div className="flex items-center gap-3">
          <img src="/njugushmitumba.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <div className="text-white font-display font-bold text-sm">Admin Panel</div>
            <div className="text-gold-400 text-[9px] uppercase tracking-[2px]">Njugush Mitumba</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {sidebarLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 transition-colors ${isActive ? 'bg-gold-500/15 text-gold-500' : 'hover:bg-navy-400 hover:text-white'}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-navy-400">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-500/10 w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-3 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-navy-500 text-white flex-shrink-0 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-500 text-white z-10 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/njugushmitumba.png" alt="Logo" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-display font-bold text-sm">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-1"><Menu className="w-5 h-5" /></button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-navy-500 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-navy-400">
              <span className="text-white font-display font-bold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/70 p-1"><X className="w-5 h-5" /></button>
            </div>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile bottom tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10">
        {mobileLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${isActive ? 'text-gold-500' : 'text-gray-400'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 md:p-8 p-4 pt-20 pb-20 md:pb-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}