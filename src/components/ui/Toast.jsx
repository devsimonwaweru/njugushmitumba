import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-navy-500',
}

export default function Toast({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.info
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 ${
              colors[toast.type]
            } text-white px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium max-w-sm transition-all duration-300 ${
              toast.removing
                ? 'translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}