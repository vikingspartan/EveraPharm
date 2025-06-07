import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdvaCare Pharma - Leading Global Pharmaceutical Manufacturer",
  description: "We manufacture and distribute more than 4,000 medical products globally. Join our network of distributors, hospitals, pharmacies and institutions.",
  keywords: "pharmaceutical manufacturer, medical devices, supplements, veterinary products, global distributor, healthcare manufacturing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
