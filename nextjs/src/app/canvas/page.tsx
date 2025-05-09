"use client";

import { Box, Grid } from "@mui/material";
import Canvas from "@/components/Canvas";
import ColorPicker from "@/components/ColorPicker";
import ChatComponent from "@/components/ChatComponent";
import { CanvasProvider } from "@/context/CanvasContext";

export default function CanvasPage() {
  return (
    <CanvasProvider>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 4em)",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          {/* Left Column - Contains Canvas and ColorPicker */}
          <Grid
            xs={12}
            md={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: { xs: "auto", md: "100%" },
            }}
          >
            {/* Canvas Container */}
            <Grid
              sx={{
                flexGrow: 1,
                minHeight: { xs: "60vh", md: 0 },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: 1,
                  boxShadow: 1,
                  overflow: "auto",
                }}
              >
                <Canvas />
              </Box>
            </Grid>

            {/* ColorPicker Container */}
            <Grid size="grow">
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: 1,
                  boxShadow: 1,
                  p: 2,
                }}
              >
                <ColorPicker />
              </Box>
            </Grid>
          </Grid>

          {/* Right Column - Contains Chat */}
          <Grid
            xs={12}
            md={4}
            sx={{
              height: { xs: "400px", md: "100%" },
            }}
          >
            <Box
              sx={{
                height: "100%",
                backgroundColor: "white",
                borderRadius: 1,
                boxShadow: 1,
                overflow: "hidden",
              }}
            >
              <ChatComponent />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CanvasProvider>
  );
}
