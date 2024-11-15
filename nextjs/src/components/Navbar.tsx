// /components/Navbar.tsx
"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

const pages = [
  { name: "Home", href: "/" },
  { name: "Canvas", href: "/canvas" },
];

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Menu Icon - Mobile Only */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    handleCloseNavMenu();
                    router.push(page.href);
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Both Mobile and Desktop */}
          <Link
            href="/canvas"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/logo.svg"
              alt="Space Logo"
              width={80}
              height={80}
              priority
            />
          </Link>

          {/* Navigation - Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                href={page.href}
                onClick={handleCloseNavMenu}
                sx={{
                  color: "white",
                  display: "block",
                  mr: 2,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Auth Section */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              // Logged in state
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ color: "white" }}>{user.email}</Typography>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              // Logged out state
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  href="/login"
                  sx={{
                    color: "white",
                    ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    ":hover": { bgcolor: "grey.100" },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
