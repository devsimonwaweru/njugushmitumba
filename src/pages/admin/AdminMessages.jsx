/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Check, Trash2, Mail } from 'lucide-react'
import { fetchMessages, markMessageAsRead, deleteMessage } from '../../services/messages'
import { formatDate } from '../../utils/helpers'

export default function AdminMessages({ addToast }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadMessages() }, [])

  async function loadMessages() {
    setLoading(true)
    try { setMessages(await fetchMessages()) }
    catch (err) { addToast('Failed to load messages', 'error') }
    finally { setLoading(false) }
  }

  async function handleMarkRead(id) {
    try { await markMessageAsRead(id); loadMessages() }
    catch (err) { addToast('Failed to mark as read', 'error') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this message?')) return
    try { await deleteMessage(id); addToast('Message deleted'); loadMessages() }
    catch (err) { addToast('Failed to delete', 'error') }
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-500 mb-6">
        Messages {unread > 0 && <span className="text-sm font-normal text-red-500 ml-2">({unread} unread)</span>}
      </h1>

      <div className="flex flex-col gap-4">
        {loading ? <p className="text-gray-400 text-center py-12">Loading...</p> :
        messages.length === 0 ? (
          <div className="text-center py-16"><Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" /><p className="text-gray-400">No messages yet.</p></div>
        ) : messages.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-5 ${m.read ? 'border-gray-200' : 'border-gold-300 bg-gold-50/30'}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-navy-500 text-sm">{m.name}</span>
                {!m.read && <span className="ml-2 bg-gold-500 text-navy-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">New</span>}
                <div className="text-gray-400 text-xs mt-1">{m.phone} {m.email ? <span> &middot; {m.email}</span> : ''}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-gray-300 text-xs hidden sm:inline">{formatDate(m.created_at)}</span>
                {!m.read && <button onClick={() => handleMarkRead(m.id)} className="text-gold-500 hover:text-gold-600 text-xs font-semibold flex items-center gap-1"><Check className="w-3 h-3" />Read</button>}
                <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-navy-400 text-sm leading-relaxed">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}