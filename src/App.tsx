import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Homepage from "./Homepage"
import Footer from "./components/ui/footer"
import "./App.css"

const SearchPage = lazy(() => import("./pages/SearchPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
      Loading…
    </div>
  )
}

function App() {
  return (
    <div className="">
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

export default App
