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
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon.ico' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/icons/site.webmanifest',
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
