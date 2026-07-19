import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-8xl font-display font-bold text-navy-100 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-navy-500 mb-2">Page Not Found</h1>
        <p className="text-navy-300 text-sm mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-700 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}