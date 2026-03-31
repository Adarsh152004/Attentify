import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import FloatingAssistant from "@/components/layout/FloatingAssistant";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VittaDrishti — Indian Investment Intelligence",
  description: "Real-time NSE/BSE data, AI stock analysis, portfolio optimization and market sentiment — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans dark", inter.variable)}>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
          <FloatingAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
