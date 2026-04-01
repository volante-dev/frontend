"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/app/theme/tokens";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/studio", label: "Studio" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: colors.offWhite,
        borderBottom: `1px solid ${colors.blueGray}`,
        color: colors.mutedBlack,
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
            color: colors.mutedBlack,
            flexGrow: 1,
          }}
        >
          STUDIO VOLANTE
        </Typography>

        <Box
          component="nav"
          sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}
        >
          {navLinks.map(({ href, label }) => (
            <Button
              key={href}
              variant="text"
              component={Link}
              href={href}
              sx={{
                color: pathname === href ? colors.green : colors.mutedBlack,
                fontWeight: pathname === href ? 600 : 400,
              }}
            >
              {label}
            </Button>
          ))}
          <Button variant="contained" component={Link} href="/contact" sx={{ ml: 2 }}>
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
