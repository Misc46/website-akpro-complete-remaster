import type { Metadata } from "next";
import { Merriweather, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";
import ClientLayout from "./components/ClientLayout";

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AKPRO IME FTUI 2026",
  description: "Akademis Praktis dan Produktif - Mendukung pembelajaran mahasiswa Teknik Elektro FTUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${merriweather.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
