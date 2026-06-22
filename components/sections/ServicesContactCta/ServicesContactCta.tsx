"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";

interface ServicesContactCtaProps {
  href: string;
  label: string;
}

const ServicesContactCta = ({ href, label }: ServicesContactCtaProps) => (
  <Box
    component="section"
    sx={{
      py: { xs: 8, md: 10 },
      px: { xs: 2, md: 4 },
      textAlign: "center",
    }}
  >
    <Button variant="contained" size="large" component={Link} href={href}>
      {label}
    </Button>
  </Box>
);

export default ServicesContactCta;
