import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Space",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
