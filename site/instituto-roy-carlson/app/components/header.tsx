
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigationItems = [
  { title: 'Início', href: '/' },
  {
    title: 'O Instituto',
    items: [
      { title: 'Institucional', href: '/institucional' },
      { title: 'Legado Furnas', href: '/legado-furnas' },
      { title: 'Parcerias Acadêmicas', href: '/parcerias' },
    ]
  },
  {
    title: 'Áreas de Atuação',
    items: [
      { title: 'Simulação Computacional', href: '/simulacao' },
      { title: 'Estudos de Caso', href: '/estudos-caso' },
      { title: 'Lajes de Fundação', href: '/lajes-fundacao' },
      { title: 'Ensaios Especiais', href: '/ensaios' },
    ]
  },
  {
    title: 'Publicações',
    items: [
      { title: 'Blog: Concretos Especiais', href: '/blog-concretos' },
      { title: 'Referências', href: '/referencias' },
    ]
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-900">
              Instituto Roy Carlson
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => item.items && setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-900 font-medium transition-colors">
                    <span>{item.title}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.items && (
                  <AnimatePresence>
                    {activeDropdown === item.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <nav className="space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="block text-gray-700 hover:text-blue-900 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900 mb-2">
                          {item.title}
                        </div>
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block pl-4 py-1 text-gray-600 hover:text-blue-900"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
