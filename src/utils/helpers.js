export function formatPrice(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getWhatsAppLink(bale, phoneNumber) {
  const msg = encodeURIComponent(
    `Hello Njugush Mitumba Bales,

I'm interested in the following bale:

Bale: ${bale?.name || "N/A"}
Price: ${formatPrice(bale?.price || 0)}
Grade: ${bale?.grade || "N/A"}
Pieces: ~${bale?.pieces || "N/A"}

Please share more details. Thank you!`
  )

  // Remove any '+' from the phone number
  const phone = String(phoneNumber).replace(/\+/g, "")

  return `https://wa.me/${phone}?text=${msg}`
}

export function getGeneralWhatsAppLink(phoneNumber) {
  const msg = encodeURIComponent(
    "Hello Njugush Mitumba Bales, I would like to enquire about your mitumba bales."
  )

  const phone = String(phoneNumber).replace(/\+/g, "")

  return `https://wa.me/${phone}?text=${msg}`
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getGradeLabel(grade) {
  const labels = {
    A: "Premium",
    B: "Standard",
    C: "Economy",
  }

  return labels[grade] || grade
}