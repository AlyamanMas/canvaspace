"use client";

import { Container, Typography, Box, Paper } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={8}
        gap={4}
      >
        <Box position="relative" width={200} height={200} mb={4}>
          <Image
            src="/logo.svg"
            alt="Space Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to Space
          </Typography>

          <Typography variant="h6" gutterBottom>
            A Collaborative Canvas Community
          </Typography>

          <Typography paragraph>
            Space is a social media platform centered around pixel art as the
            primary mode of expression. Users can contribute to a shared canvas
            one pixel at a time, working together to create coherent images and
            become part of a collective artistic story.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Key Features
          </Typography>

          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Real-time collaborative canvas editing</li>
            <li>Community-driven pixel art creation</li>
            <li>Cross-platform support (Web, Android, iOS)</li>
            <li>Secure user authentication</li>
            <li>In-app messaging and forums</li>
            <li>Canvas history timeline</li>
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Join Our Community
          </Typography>

          <Typography paragraph>
            Be part of a unique digital art experience where every pixel tells a
            story. Create an account today to start contributing to our
            ever-evolving canvas and connect with fellow artists from around the
            world.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
