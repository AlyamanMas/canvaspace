"use client";
import type { Metadata } from "next";
import "./globals.css";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useIdleTimer } from "react-idle-timer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/Navbar";
import { Box } from "@mui/material";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<string>("Active");
  const router = useRouter();

  const onIdle = async () => {
    setState("Idle");
    await signOut(auth);
    console.log("idle");
    router.push("/");
  };

  const onActive = () => {
    setState("Active");
    console.log("active");
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 300_000,
    throttle: 500,
  });

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <Box sx={{ pt: 8 }}>{children}</Box>
        </AuthProvider>
      </body>
    </html>
  );
}
