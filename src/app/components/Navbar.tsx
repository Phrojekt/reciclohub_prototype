"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Feed", href: "/feed" },
  { label: "Meus resíduos", href: "/my-offers" },
  { label: "Registrar resíduo", href: "/residues/register" },
  { label: "Propostas Recebidas", href: "/my-offers/proposals-received" },
  { label: "Negociação", href: "/chat" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Limpar dados de autenticação
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.clear()
      
      // Usar router.push com replace para evitar histórico
      router.push('/')
      
      // Forçar refresh da página para garantir limpeza completa
      window.location.reload()
    } catch {
      // Fallback se houver erro
      window.location.href = '/'
    }
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white shadow-md flex-col z-30">
        {/* Logo */}
        <div className="flex items-center px-8 py-8 border-b border-gray-100">
          <Image
            src="/RECICLOHUB_Green.png"
            alt="RecicloHub"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-8 py-3 text-base font-medium flex items-center transition-colors
                ${
                  pathname === item.href
                    ? "bg-[#E6F7F8] text-[#009CA6] border-l-4 border-[#009CA6]"
                    : "text-gray-700 hover:bg-[#F3FBFB]"
                }
              `}
            >
              {item.href === "/residues/register"}
              {item.label}
            </Link>
          ))}
          
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            className="px-8 py-3 text-base cursor-pointer font-medium flex items-center transition-colors text-gray-700 hover:bg-[#F3FBFB] text-left"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>

        {/* Logo Hub no rodapé */}
        <div className="mt-auto px-8 py-8 flex items-center justify-center">
          <Image
            src="/RecicloHub_CircleGreen_logo.png"
            alt="Hub"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </aside>

      {/* Navbar mobile */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#03A2AA] flex items-center justify-between px-4 z-40">
        <Image
          src="/RECICLOHUB_White.png"
          alt="RecicloHub"
          width={110}
          height={32}
          className="object-contain"
        />
        <button
          className="text-white"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-8 h-8" />
        </button>
      </header>

      {/* Dropmenu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <Image
              src="/RECICLOHUB_Green.png"
              alt="RecicloHub"
              width={120}
              height={40}
              className="object-contain"
            />
            <button
              className="text-gray-600"
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg width={28} height={28} fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#03A2AA"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 px-8 py-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-4 text-lg font-medium flex items-center border-b border-gray-100 ${
                  pathname === item.href
                    ? "text-[#009CA6]"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.href === "/residues/register"}
                {item.label}
              </Link>
            ))}
            
            {/* Botão de Logout Mobile */}
            <button
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              className="py-4 text-lg font-medium flex cursor-pointer items-center border-b border-gray-100 text-gray-700 text-left"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </nav>
          <div className="px-8 py-8 flex items-center justify-center">
            <Image
              src="/RecicloHub_CircleGreen_logo.png"
              alt="Hub"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}