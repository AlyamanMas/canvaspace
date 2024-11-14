"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const maxAttempts = 5;
  const cooldownDuration = 30; // seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    } else if (cooldownTime === 0 && loginAttempts >= maxAttempts) {
      // Reset attempts after cooldown
      setLoginAttempts(0);
      setError(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime, loginAttempts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if in cooldown
    if (cooldownTime > 0) {
      setError(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    // Check if fields are empty
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/"); // Redirect to home page after successful login
    } catch (err: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setCooldownTime(cooldownDuration);
        setError(
          `Too many failed attempts. Please try again in ${cooldownDuration} seconds`,
        );
      } else {
        setError(
          `Invalid email or password. ${maxAttempts - newAttempts} attempts remaining`,
        );
      }
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Image
            src="/logo.svg"
            alt="Space Logo"
            width={120}
            height={120}
            priority
          />
        </Box>

        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Log in to Space
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {cooldownTime > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography>Cooldown: {cooldownTime}s</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={cooldownTime > 0}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
            disabled={cooldownTime > 0}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || cooldownTime > 0}
            sx={{ mb: 2 }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Typography color="primary">
                Don't have an account? Sign up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
