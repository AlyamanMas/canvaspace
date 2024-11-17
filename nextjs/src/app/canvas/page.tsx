"use client";
import ChatComponent from "@/components/ChatComponent";
import { Box, Typography } from "@mui/material";

export default function ChatPage() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat Room
      </Typography>
      <ChatComponent />
    </Box>
  );
}
