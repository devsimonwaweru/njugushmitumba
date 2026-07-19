import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import HeroSection from '../components/sections/HeroSection'
import CategoriesSection from '../components/sections/CategoriesSection'
import CatalogueSection from '../components/sections/CatalogueSection'
import WhyUsSection from '../components/sections/WhyUsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import FAQSection from '../components/sections/FAQSection'
import ContactSection from '../components/sections/ContactSection'

export default function HomePage({ addToast }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const location = useLocation()
  
  // Fetch settings from the context to pass to child components
  const { settings } = useSettings()

  // Handle scroll to section from hash (e.g., when clicking a nav link)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      // Small delay to let content render completely before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location.hash])

  const handleCategorySelect = useCallback((id) => {
    setSelectedCategory(id)
  }, [])

  // Show a loading state while settings are being fetched from the backend/context
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <>
      {/* 
        Pass the settings object down to the sections that need it.
        HeroSection uses it for the title, subtitle, and background image.
        WhyUsSection uses it for years of experience and business name.
        ContactSection uses it for phone, email, address, and social links.
      */}
      <HeroSection settings={settings} />
      <CategoriesSection onCategorySelect={handleCategorySelect} />
      <CatalogueSection addToast={addToast} initialCategory={selectedCategory} />
      <WhyUsSection settings={settings} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection addToast={addToast} settings={settings} />
    </>
  )
}