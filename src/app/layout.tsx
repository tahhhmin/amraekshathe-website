import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderLayout from "@/components/header/HeaderLayout";
import ClientProviders from "./ClientProviders";  // Use relative import here
import { Montserrat } from "next/font/google";
import FooterLayout from "@/components/footer/FooterLayout";
import 'leaflet/dist/leaflet.css';

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["400", "500", "600", "700"],
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amra Ekshathe",
  description: "Volunteering Network Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable}`}>
                <ClientProviders>
                    <HeaderLayout />
                    {children}
                    <FooterLayout />
                </ClientProviders>
            </body>
        </html>
    );
}
