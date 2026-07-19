export default function ContactSection({  settings }) {
  const phone = settings?.phone || 'N/A'
  const whatsapp = settings?.whatsapp || 'N/A'
  const email = settings?.email || 'N/A'
  const address = settings?.address || 'N/A'
  const businessName = settings?.business_name || 'Our Store'

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-navy-500 mb-6">Get In Touch</h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Have questions? Contact {businessName} today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Phone & WhatsApp */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="text-navy-500 font-semibold mb-3">Phone</h4>
            <p className="text-sm text-gray-600 mb-1">Call: <a href={`tel:${phone}`} className="text-gold-600">{phone}</a></p>
            <p className="text-sm text-gray-600">WhatsApp: <a href={`https://wa.me/${whatsapp}`} className="text-gold-600">{whatsapp}</a></p>
          </div>

          {/* Email & Address */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="text-navy-500 font-semibold mb-3">Details</h4>
            <p className="text-sm text-gray-600 mb-1">Email: <a href={`mailto:${email}`} className="text-gold-600">{email}</a></p>
            <p className="text-sm text-gray-600">Address: {address}</p>
          </div>

          {/* Socials */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="text-navy-500 font-semibold mb-3">Follow Us</h4>
            <div className="flex flex-col space-y-1 text-sm text-gray-600">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-gold-600">Facebook</a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-gold-600">Instagram</a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" className="hover:text-gold-600">Twitter</a>}
              {settings?.tiktok && <a href={settings.tiktok} target="_blank" rel="noreferrer" className="hover:text-gold-600">TikTok</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}