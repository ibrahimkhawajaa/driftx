import { useState, useEffect, memo } from "react"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    { label: "Home", to: "/" },
    { label: "Search", to: "/search" },
  ]

  return (
    <>
      <nav className="bg-[#606c38] text-white">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-7 sm:py-5">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/logo-monarque.png"
              alt="Monarque Stays"
              className="h-30 w-auto object-fit sm:h-20 object-fit"
            />
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* <Link
              to="/search"
              className="hidden text-sm text-[#606c38] transition hover:text-[#1e1b7f] sm:inline"
            >
              Search
            </Link> */}
            {/* <User className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-70" /> */}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative bottom-1 flex h-8 w-8 items-center justify-center">
                <span
                  className={`absolute h-[1px] w-12 rounded-full bg-white transition-all duration-200 ${
                    isMenuOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute h-[1px] w-12 rounded-full bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 top-0 z-50 bg-black transition-all duration-500 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "100vh" }}
      >
        <div
          className="absolute inset-0"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden
        />

        <div className="relative flex h-full flex-col items-center justify-center px-8">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-12 top-12 flex h-8 w-8 items-center justify-center focus:outline-none"
            aria-label="Close menu"
          >
            <span className="absolute h-[1px] w-12 rotate-45 bg-white"></span>
            <span className="absolute h-[1px] w-12 -rotate-45 bg-white"></span>
          </button>

          <img
            src="/logo-monarque.png"
            alt=""
            className="mb-10 h-30 w-auto object-fit opacity-90"
          />

          <div className="space-y-8 text-center  ">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="block  text-3xl font-light text-white transition-opacity duration-300 hover:opacity-70 sm:text-4xl md:text-5xl"
                style={{
                  animation: isMenuOpen
                    ? `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                    : "none",
                  opacity: 0,
                  transform: "translateY(20px)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="absolute bottom-8 text-sm text-white/30">
            © {new Date().getFullYear()} Monarque Stays
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
        body {
          overflow: ${isMenuOpen ? "hidden" : "auto"};
        }
      `}</style>
    </>
  )
}

export default memo(Navbar)
