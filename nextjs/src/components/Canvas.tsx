import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCanvas } from "@/context/CanvasContext";
import { auth } from "../lib/firebase";
import { socket } from "../lib/socket";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api.com" // TODO: Replace with your production API URL
    : "http://localhost:3111";

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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        overflow: "auto",
        border: "1px solid #ccc",
        borderRadius: 1,
        backgroundColor: "white",
        boxShadow: 1,
        p: 2,
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          {pixels.map((row, y) => (
            <tr key={y}>
              {row.map(([token, color], x) => (
                <td
                  key={`${x}-${y}`}
                  onClick={() => handlePixelClick(x, y)}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: color,
                    border: "1px solid #eee",
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
  );
}
