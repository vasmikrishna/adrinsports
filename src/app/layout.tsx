import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headings",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ADRIN Sports | Premium Cricket & Hockey Gear",
  description: "Experience the next generation of sports performance with professional-grade cricket bats, wind balls, composite hockey sticks, and training gear. Crafted for power, balance, and absolute durability.",
  keywords: "adrin sports, cricket bats, hockey sticks, jalandhar sports, wind balls, pvc cricket balls, sports equipment manufacturer, custom team supplies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}


