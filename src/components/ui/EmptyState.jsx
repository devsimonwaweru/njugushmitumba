import { PackageX } from 'lucide-react'

export default function EmptyState({ icon: Icon = PackageX, title, description }) {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-navy-200" />
      </div>
      <h3 className="font-display text-xl font-bold text-navy-400 mb-2">{title}</h3>
      <p className="text-navy-300 text-sm max-w-md mx-auto">{description}</p>
    </div>
  )
}