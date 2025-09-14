import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartPanel from "@/components/CartPanel";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import { RegisterProvider } from "@/context/RegisterContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Disiento",
  description: "Tienda online Disiento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <RegisterProvider>
            <Navbar />
            {/* separador para que el contenido no quede debajo del navbar */}
            <div className="navbar-spacer" />
            {children}
            <Footer />
            <CartPanel />
            <WhatsappButton />
          </RegisterProvider>
        </CartProvider>
      </body>
    </html>
  );
}
