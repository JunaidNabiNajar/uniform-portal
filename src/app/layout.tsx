import type { Metadata } from "next"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "SSS Online Shopping - Premium Uniforms",
  description: "Shop premium school and corporate uniforms online at SSS.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
