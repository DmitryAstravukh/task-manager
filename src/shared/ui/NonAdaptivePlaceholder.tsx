import { Box, Typography } from "@mui/material";

type NonAdaptivePlaceholderProps = {
  message?: string;
  imgSrc?: string;
};

export const NonAdaptivePlaceholder = ({
  message = "Про адаптив речи в ТЗ не было, сделайте окно шире :)",
  imgSrc = "/dog.jpg",
}: NonAdaptivePlaceholderProps) => {
  return (
    <Box
      sx={{
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 3,
        boxSizing: "border-box",
        display: "flex",
      }}
    >
      <Box sx={{ maxWidth: 520, width: "100%" }}>
        <Box
          component="img"
          src={imgSrc}
          alt="Dog"
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
            boxShadow: 3,
            mb: 2,
          }}
        />

        <Typography variant="h6">{message}</Typography>
      </Box>
    </Box>
  );
};
