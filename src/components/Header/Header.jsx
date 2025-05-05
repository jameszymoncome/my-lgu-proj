import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it appears above the Drawer
        backgroundColor: "#FFFF",
      }}
    >
      <Toolbar>
      <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <img
            src="./sample_logo.png" // Replace with your logo's path
            alt="Logo"
            style={{ width: "55px", height: "55px", marginRight: "10px", boxShadow: "1px" }} // Adjust dimensions and spacing
          />

          {/* Text */}
          <Typography variant="h6" noWrap style={{color: "#0F1D9F"}}>
            PPE Management System
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
