import { useState, useEffect } from "react"
import { User } from "lucide-react"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMenuOpen])

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/discover" },
    { label: "Favorites", href: "/favorites" },
    { label: "Settings", href: "/settings" },
  ]

  return (
    <>
      <nav className="bg-[#0f084b] text-white">
        <div className="flex w-full items-center justify-end gap-6 px-7 py-7">
          <User className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-70" />

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative flex h-8 w-8 items-center justify-center bottom-1">
              {/* Top line */}

              {/* Middle line - fades out when menu is open */}
              <span
                className={`absolute h-[1px] w-8 rounded-full bg-white transition-all duration-200 ${
                  isMenuOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              ></span>

              {/* Bottom line */}
              <span
                className={`absolute h-[1px] w-8 rounded-full bg-white transition-all duration-300 ease-out ${
                  isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Full Page Menu - Clean Black Design */}
      <div
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-500 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "100vh" }}
      >
        {/* Close button area - click outside to close */}
        <div
          className="absolute inset-0"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-8">
          {/* Close button - X in top right */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-7 right-7 flex h-8 w-8 items-center justify-center focus:outline-none"
            aria-label="Close menu"
          >
            <span className="absolute h-[1px] w-8 rotate-45 bg-white"></span>
            <span className="absolute h-[1px] w-8 -rotate-45 bg-white"></span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-8 text-center">
            {menuItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-4xl font-light text-black transition-opacity duration-300 hover:opacity-50 sm:text-5xl md:text-6xl"
                style={{
                  animation: isMenuOpen
                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                    : "none",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Footer */}
          <p className="absolute bottom-8 text-sm text-white/30">
            © 2024 DreamSpace
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Prevent body scroll */
        body {
          overflow: ${isMenuOpen ? "hidden" : "auto"};
        }
      `}</style>
    </>
  )
}

export default Navbar
