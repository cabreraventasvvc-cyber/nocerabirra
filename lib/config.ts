export const siteConfig = {
  name: "Nocera",
  legalName: "Nocera Distribuidora",
  location: "Av. Carlos Pellegrini 3478, Quilmes Oeste, Provincia de Buenos Aires, Argentina",
  priceListDate: "2026-09-19",
  phone: "+54 9 11 3783-1254",
  email: "distribuidoradesimone@gmail.com",
  openingHours: "De 7.30 a 16 hs.",
  whatsappNumber: "5491137831254",
  whatsappLabel: "Solo mensajes",
  instagram: {
    distribuidora: "https://www.instagram.com/de.simone.distribuidora"
  },
  sections: {
    barEnabled: false
  }
} as const;

export const contactPlaceholders = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  openingHours: `${siteConfig.openingHours} ${siteConfig.whatsappLabel}.`
} as const;

export const contactLinks = {
  email: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent("Consulta desde la web Nocera Birra")}`,
  whatsapp: `https://wa.me/${siteConfig.whatsappNumber}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.location)}`
} as const;
