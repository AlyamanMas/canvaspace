"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
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
} from "@mui/material";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date().toISOString(),
        pixelsPlaced: 0,
        lastPixelPlaced: null,
      });

      router.push("/"); // Redirect to home page after successful signup
    } catch (err: any) {
      setError(err.message || "Failed to create an account");
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
          Sign Up for Space
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Typography color="primary">
                Already have an account? Log in
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
