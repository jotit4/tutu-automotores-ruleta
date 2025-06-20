import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ruleta Stromberg - ¡Participa y Gana!',
  description: 'Participa en la ruleta de la fortuna de Stromberg y gana increíbles premios',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-stromberg-bg bg-cover bg-center bg-no-repeat">
          <div className="min-h-screen bg-black bg-opacity-30">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}