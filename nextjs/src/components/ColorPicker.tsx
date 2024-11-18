import { Box } from "@mui/material";
import { useCanvas } from "@/context/CanvasContext";

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#808080",
  "#C0C0C0",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
];

export default function ColorPicker() {
  const { selectedColor, setSelectedColor } = useCanvas();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        p: 2,
        backgroundColor: "white",
        borderRadius: 1,
      }}
    >
      {COLORS.map((color) => (
        <Box
          key={color}
          onClick={() => setSelectedColor(color)}
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: color,
            border:
              color === selectedColor ? "3px solid #000" : "1px solid #ccc",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        />
      ))}
    </Box>
  );
}
