// Footer.tsx - Asymmetrical Innovative Design
import React from "react"
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const navigation = [{ name: "Search", href: "/search" }]

  return (
    <footer className="relative bg-[#606c38] text-white rounded-t-xl">
      {/* Abstract background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden ">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-600/10 to-transparent blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Innovative 2-1 grid layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Brand + Info (spans 2 columns on large screens) */}
          <div className="space-y-8 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logo-monarque.png"
                alt="Monarque Stays"
                className="h-14 w-auto object-contain sm:h-16"
              />
            </div>

            <p className="max-w-md text-base leading-relaxed text-white/60">
              Monarque Stays — refined rentals and homes. Simple, transparent,
              and beautifully curated.
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold">50k+</p>
                <p className="text-xs tracking-wider text-white/40 uppercase">
                  Happy clients
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-xs tracking-wider text-white/40 uppercase">
                  Cities covered
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs tracking-wider text-white/40 uppercase">
                  Support
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card Style */}
          <div className="p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Get in touch
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:hello@monarquestays.com"
                className="group flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <Mail size={16} />
                </div>
                <span className="text-sm transition-colors group-hover:text-white">
                  hello@monarquestays.com
                </span>
              </a>
              <a
                href="tel:+1234567890"
                className="group flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                  <Phone size={16} />
                </div>
                <span className="text-sm transition-colors group-hover:text-white">
                  +1 (234) 567-890
                </span>
              </a>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin size={16} />
                </div>
                <span className="text-sm text-white/60">
                  123 Luxury Avenue
                  <br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Row - Horizontal */}
        <div className="mt-16 flex flex-wrap items-center justify-between border-t border-white/10 pt-8">
          <div className="flex gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
              >
                {item.name}
                <ArrowUpRight
                  size={12}
                  className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>

          {/* <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Twitter size={16} />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Linkedin size={16} />
            </a>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 text-center text-xs text-white/30">
          © {currentYear} Monarque Stays. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
