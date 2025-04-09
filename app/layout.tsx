import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TarotProvider } from "@/context/useTarotContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tarot AI",
  description: "Interactive AI-powered Tarot Reading Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TarotProvider>{children}</TarotProvider>
      </body>
    </html>
  );
}
