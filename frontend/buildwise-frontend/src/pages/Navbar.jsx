import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import LoginModal from "./login-model"
import SignupModal from "./signup-model"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              BuildWise
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">
              Demo
            </a>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-5 py-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105"
            >
              Sign Up
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">
                Demo
              </a>
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsSignupModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-5 py-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </header>
  )
}
