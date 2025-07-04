import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Backdrop(theme) {
  // const varLow = alpha(theme.palette.grey[900], 0.48);
  const varLow = alpha(theme.palette.grey[400], 0.7);
  const varHigh = alpha(theme.palette.grey[400], 0.7);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // background: [
          //   `rgb(22,28,36)`,
          //   `-moz-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          //   `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          //   `linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          // ],
          background: varLow,
          "&.MuiBackdrop-invisible": {
            background: "transparent",
          },
          backdropFilter: `blur(3px)`,
        },
      },
    },
  };
}
