import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Particuliers - Connexion",
  description: "Identifiez-vous pour accéder à vos comptes en toute sécurité",
  icons: {
    icon: [
      { url: "/31t.jpg", type: "image/jpeg" },
    ],
    apple: "/31t.jpg",
    shortcut: "/31t.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
        {/* Fallback links (with cache-busting) */}
        <link rel="icon" type="image/jpeg" href="/31t.jpg?v=2" />
        <link rel="apple-touch-icon" href="/31t.jpg?v=2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
