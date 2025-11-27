import { ThemeProvider } from "@/lib/ThemeContext";
import { GenresProvider } from "@/lib/GenresContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yuki - Anime Streaming Platform",
  description:
    "Stream your favorite anime with Yuki - the ultimate anime streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}>
        <ThemeProvider>
          <LanguageProvider>
            <GenresProvider>
              {children}
            </GenresProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
