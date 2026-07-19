import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { fetchCategories } from '../../services/catalogue'
import { useEffect, useState } from 'react'

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 16.2a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 005.58 2.17V3.41a4.85 4.85 0 01-1.01-.12 4.83 4.83 0 01-3.04-1.6z" />
    </svg>
  )
}

const socialLinks = [
  { icon: FacebookIcon, key: 'facebook', label: 'Facebook' },
  { icon: InstagramIcon, key: 'instagram', label: 'Instagram' },
  { icon: TwitterIcon, key: 'twitter', label: 'Twitter' },
  { icon: TikTokIcon, key: 'tiktok', label: 'TikTok' },
]

export default function Footer() {
  const { settings } = useSettings()
  const [cats, setCats] = useState([])
  useEffect(() => { fetchCategories().then(setCats).catch(console.error) }, [])
  const s = settings || { business_name: 'Njugush Mitumba Bales', phone: '+254 712 345 678', email: 'info@njugushmitumba.co.ke', address: 'Warehouse 12, Gikomba Market, Nairobi, Kenya' }

  return (
    <footer className="bg-navy-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-600">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/njugushmitumba.png" alt="Njugush Mitumba Bales" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <div className="text-white font-display font-bold text-lg leading-tight">Njugush Mitumba</div>
                <div className="text-gold-400 text-[10px] uppercase tracking-[3px]">Bales</div>
              </div>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed mb-5">Quality. Affordable. Trusted. Your reliable partner for premium wholesale mitumba bales in Kenya.</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, key, label }) => (
                <a key={key} href={s[key] || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-gold-500 text-navy-200 hover:text-navy-700 flex items-center justify-center transition-all" aria-label={label}><Icon /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[['Home','hero'],['Catalogue','catalogue'],['Why Choose Us','why-us'],['Testimonials','testimonials'],['FAQ','faq'],['Contact','contact']].map(([item, id]) => (
                <li key={item}><a href={`/#${id}`} className="text-navy-200 hover:text-gold-400 text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Categories</h4>
            <ul className="flex flex-col gap-3">
              {cats.slice(0, 6).map((cat) => (
                <li key={cat.id}><a href="/#catalogue" className="text-navy-200 hover:text-gold-400 text-sm transition-colors">{cat.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-display font-bold mb-5">Contact Info</h4>
            <ul className="flex flex-col gap-3 text-sm text-navy-200">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />{s.address}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />{s.phone}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />{s.email}</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />Mon-Sat: 7am - 6pm</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy-300 text-sm">&copy; {new Date().getFullYear()} {s.business_name}. All rights reserved.</p>
          <Link to="/admin/login" className="text-navy-400 hover:text-gold-400 text-xs transition-colors">Admin Panel</Link>
        </div>
      </div>
    </footer>
  )
}