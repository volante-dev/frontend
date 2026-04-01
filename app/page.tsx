import { Box, Typography, Button, Stack } from "@mui/material";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        To get started, edit the page.tsx file.
      </Typography>
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" href="https://nextjs.org/docs" target="_blank">
          Documentation
        </Button>
        <Button variant="outlined" href="https://nextjs.org/learn" target="_blank">
          Learning
        </Button>
      </Stack>
    </Box>
  );
}
