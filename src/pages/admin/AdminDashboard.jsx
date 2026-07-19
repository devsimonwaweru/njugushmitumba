/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Package, CheckCircle, Grid3X3, Mail, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchBales, fetchCategories } from '../../services/catalogue'
import { fetchMessages } from '../../services/messages'
import { formatPrice } from '../../utils/helpers'

export default function AdminDashboard({ addToast }) {
  const [bales, setBales] = useState([])
  const [categories, setCategories] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [balesRes, cats, msgs] = await Promise.all([
          fetchBales({ perPage: 100 }),
          fetchCategories(),
          fetchMessages(),
        ])
        setBales(balesRes.bales)
        setCategories(cats)
        setMessages(msgs)
      } catch (err) {
        addToast('Failed to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [addToast])

  const available = bales.filter(b => b.available).length
  const unread = messages.filter(m => !m.read).length

  const stats = [
    { icon: Package, label: 'Total Bales', value: bales.length, color: 'bg-gold-50 text-gold-500' },
    { icon: CheckCircle, label: 'Available', value: available, color: 'bg-green-50 text-green-500' },
    { icon: Grid3X3, label: 'Categories', value: categories.length, color: 'bg-blue-50 text-blue-500' },
    { icon: Mail, label: 'Unread Messages', value: unread, color: 'bg-red-50 text-red-500' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-500 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-navy-500">{loading ? '...' : value}</div>
            <div className="text-gray-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-navy-500">Recent Bales</h2>
          <Link to="/admin/bales" className="text-gold-500 hover:text-gold-600 text-sm font-semibold">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4">Bale</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading...</td></tr>
              ) : bales.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No bales yet. <Link to="/admin/bales" className="text-gold-500 font-semibold">Add your first bale</Link></td></tr>
              ) : (
                bales.slice(0, 5).map(bale => (
                  <tr key={bale.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={bale.images?.[0]?.image_url || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-medium text-navy-500 text-xs truncate max-w-[200px] block">{bale.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{bale.category?.name || '-'}</td>
                    <td className="p-4 text-gold-600 font-semibold text-xs">{formatPrice(bale.price)}</td>
                    <td className="p-4"><span className="bg-gray-100 text-navy-500 text-[10px] font-bold px-2 py-0.5 rounded">Grade {bale.grade}</span></td>
                    <td className="p-4">{bale.available ? <span className="text-green-600 text-xs font-semibold">Available</span> : <span className="text-red-500 text-xs font-semibold">Sold Out</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}