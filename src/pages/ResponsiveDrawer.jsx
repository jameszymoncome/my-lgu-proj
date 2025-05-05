import React, { useState } from "react";
import { Drawer, AppBar, Toolbar, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";

const ResponsiveDrawer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)"); // Define breakpoint for mobile

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <h1>Responsive Drawer</h1>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // Switch variant based on screen size
        open={isMobile ? isDrawerOpen : true} // Control visibility for mobile
        onClose={toggleDrawer} // Close drawer on mobile
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
          },
        }}
      >
        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default ResponsiveDrawer;
