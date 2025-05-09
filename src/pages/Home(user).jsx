import React, { useState, useEffect } from "react";
import "./Home.css"; // Custom styles
import Icon from "../assets/images/sample_icon.png";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Collapse} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Header from "../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const drawerWidth = 240;

function Home_user() {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected menu item
  const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index); // Update selected menu item
    navigate(path); // Navigate to the selected route
  };

  const handleLogout = (index, path) => {
      setSelectedIndex(index); // Update the selected menu item
      Swal.fire({
        icon: "question",
        title: "Are you sure?",
        text: "Do you really want to log out?",
        showCancelButton: true, // Show the "No" button
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "No, Stay",
        background: "#f9f9f9", // Light background
        color: "#333", // Dark text color for contrast
        confirmButtonColor: "#d33", // Red color for "Yes" button
        cancelButtonColor: "#0F1D9F", // Blue color for "No" button
        customClass: {
          popup: "minimal-popup", // Add a custom class for further styling
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform logout logic
          localStorage.clear(); // Clear user data
          navigate(path); // Redirect to login page
        } else {
          // Optional: Handle "No" button click (if needed)
          console.log("User chose to stay logged in.");
        }
      });
    };

  const toggleReportMenu = () => {
    setReportMenuOpen((prevOpen) => !prevOpen); // Toggle sub-menu visibility
  };

  const [firstName, setFirstName] = useState("");
  const [userRole, setUserRole] = useState("");
    
      useEffect(() => {
        const storedFirstName = localStorage.getItem("firstName");
        const storeduserRole = localStorage.getItem("userRole");
        if (storedFirstName) {
            setFirstName(storedFirstName);
            setUserRole(storeduserRole);
        } else {
            navigate("/login"); // Redirect to login if no first name is found
        }
    }, [navigate]);

  return (
    <div style={{ display: "flex" }}>
      {/* Header */}
      <Header />

      {/* Sidebar using Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "4rem",
            backgroundColor: "#FFFF",
            cursor: "pointer",
          },
        }}
      >
        <List>
          <ListItem
            button
            style={{ color: "#0F1D9F"}}
            onClick={() => handleListItemClick(0, "/home-user")}
          >
            <ListItemIcon>
              <HomeIcon style={{ color:"#0F1D9F"}} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/purchase-request")}
          >
            <ListItemIcon>
              <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItem>
          {/* Main Report Button */}
          <ListItem button onClick={toggleReportMenu}>
            <ListItemIcon>
              <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Records" />
            {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {/* Sub-Buttons (collapsible) */}
          <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(5, "/user-parics1")}
              >
                <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(4, "/user-invreport")}
              >
              <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => handleListItemClick(6, "/user-profile")}
          >
            <ListItemIcon>
              <AccountCircleIcon/>
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem 
            button
            onClick={() => handleLogout(7, "/")}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          padding: "80px 20px", // Add top padding to account for the AppBar
        }}
      >
        <header>
          <h1>Hello, {firstName}! Welcome back, {userRole}!</h1>
          <input type="search" placeholder="Search" className="search-bar-home" />
        </header>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <img src={Icon} alt="Asset Icon" />
            <p>Total No. of Assets</p>
          </div>
          <div className="card">
            <img src={Icon} alt="Issued Icon" />
            <p>Total Issued Items</p>
          </div>
          <div className="card">
            <img src={Icon} alt="Inspection Icon" />
            <p>Items Due for Inspection</p>
          </div>
          <div className="card">
            <img src={Icon} alt="Maintenance Icon" />
            <p>Items in Need of Maintenance</p>
          </div>
        </div>

        {/* Buttons and Recent Activity */}
        <div className="actions-activity">
          <div className="buttons" style={{ marginTop: "20px" }}>
            <button className="add-item">+ Add Item</button>
            <button className="request-item">Requested Item</button>
            <button className="scan-item">Scan</button>
          </div>
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <TableContainer
              component={Paper}
              style={{
                marginTop: "20px",
                width: "100%",
                maxWidth: "1200px",
                height: "500px", // Fixed height
                margin: "0 auto",
              }}
            >
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem", width: "500px" }}>Activity</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem", width: "500px" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem", width: "500px" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem", width: "500px" }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ height: "80px" }}>
                    <TableCell sx={{ fontSize: "1rem" }}>Asset Added</TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>Completed</TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>2024-12-01</TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>Asset ID: 12345</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home_user;
