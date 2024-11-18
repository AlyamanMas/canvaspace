import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCanvas } from "@/context/CanvasContext";
import { auth } from "../lib/firebase";
import { socket } from "../lib/socket";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api.com" // TODO: Replace with your production API URL
    : "http://localhost:3111";

const CELL_SIZE = 10; // pixels - adjust this value to change the size of cells

export default function Canvas() {
  const [pixels, setPixels] = useState([]);
  const { selectedColor } = useCanvas();

  useEffect(() => {
    // Fetch initial canvas data
    fetch(`${API_BASE_URL}/canvas`)
      .then((response) => response.json())
      .then((data) => setPixels(data))
      .catch((error) => console.error("Error fetching canvas:", error));

    // Listen for new pixels
    socket.on("new_pixel", ([token, pixel]) => {
      setPixels((prevPixels) => {
        const newPixels = [...prevPixels];
        newPixels[pixel.y][pixel.x] = [token, pixel.color];
        return newPixels;
      });
    });

    // Clean up socket listener when component unmounts
    return () => {
      socket.off("new_pixel");
    };
  }, []);

  const handlePixelClick = async (x, y) => {
    if (!auth.currentUser) {
      console.log("User must be logged in to place pixels");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      socket.emit("new_pixel", token, {
        x,
        y,
        color: selectedColor,
      });
    } catch (error) {
      console.error("Error placing pixel:", error);
    }
  };

  if (!pixels.length) {
    return <Box sx={{ p: 2, textAlign: "center" }}>Loading canvas...</Box>;
  }

  // Calculate total width and height
  const totalWidth = pixels[0].length * CELL_SIZE;
  const totalHeight = pixels.length * CELL_SIZE;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        border: "1px solid #ccc",
        borderRadius: 1,
        backgroundColor: "white",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          width: totalWidth,
          height: totalHeight,
          minWidth: "100%",
          position: "relative",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: totalWidth,
            height: totalHeight,
            border: "1px solid #ccc",
          }}
        >
          <tbody>
            {pixels.map((row, y) => (
              <tr key={y} style={{ height: CELL_SIZE }}>
                {row.map(([token, color], x) => (
                  <td
                    key={`${x}-${y}`}
                    onClick={() => handlePixelClick(x, y)}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      minWidth: CELL_SIZE,
                      minHeight: CELL_SIZE,
                      backgroundColor: color,
                      padding: 0,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
