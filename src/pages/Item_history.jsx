import React, { useState, useEffect } from "react"; // Import useState and useEffect
import "./Item_history.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Typography } from "@mui/material";
import Header from "../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import axios from "axios"; // Import Axios for API calls
import Swal from "sweetalert2"; // Import SweetAlert for alerts




const drawerWidth = 240;


const TextInput = () => {
  
    return (
      <div className="input-container">
        {/* First Input */}
        <div className="input-group">
          <label htmlFor="description" className="label">
            Description:
          </label>
          <input
            type="text"
            id="description"
            className="text-input"
            placeholder="Enter description "
            style={{ width: "53%" }}
          />
        </div>
 
        {/* Second Input */}
        <div className="input-group">
          <label htmlFor="par/ics no." className="label">
            PAR/ICS No.:
          </label>
          <input
            type="text"
            id="par/ics no."
            className="text-input"
            placeholder="Enter PAR/ICS no."
            style={{ width: "63%" }}
          />
        </div>
 
        {/* Third Input */}
        <div className="input-group">
          <label htmlFor="date acquired" className="label">
            Date Acquired:
          </label>
          <input
            type="text"
            id="date acquired"
            className="text-input"
            placeholder="Enter date acquired"
            style={{ width: "50%" }}
          />
        </div>
 
        {/* Fourth Input */}
        <div className="input-group">
          <label htmlFor="property/inventory no." className="label">
            Property/Inventory No.:
          </label>
          <input
            type="text"
            id="property/inventory no."
            className="text-input"
            placeholder="Enter property/inventory no."
            style={{ width: "50%" }}
          />
        </div>
      </div>
    );
  };


  const StyledTableCell = styled(TableCell)(({ isHeader }) => ({
    fontWeight: isHeader ? "bold" : "normal",
    fontSize: isHeader ? "16px" : "14px",
    color: isHeader ? "#0f1d9f" : "#333333",
    textAlign: "center",
    padding: "10px 16px",
    borderBottom: isHeader ? "2px solid #979797" : "none",
    borderLeft: "none",
    borderRight: "none",
  }));
 
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: "10px",
    marginLeft: "30px",
    marginRight: "20px",
    width: "100%",
    maxWidth: "1130px",
    overflowY: "auto",
    borderRadius: "10px",
    border: "1px solid #979797",
  }));
 
function Item_history() {
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
  return (
    <div style={{ display: "flex" }}>
      <Header />
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
            onClick={() => handleListItemClick(0, "/home")}
          >
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/ppe-entry")}
          >
            <ListItemIcon>
              <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="PPE Entry Form" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(2, "/inven-inspect")}
          >
            <ListItemIcon>
              <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Inspection" />
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
                onClick={() => handleListItemClick(5, "/par-ics")}
              >
                <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32, color: "#0F1D9F"}}
                onClick={() => handleListItemClick(4, "/inventory")}
              >
              <ListItemIcon style={{ color:"#0F1D9F"}} >
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            style={{ color: selectedIndex === 6 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleListItemClick(6, "/account-management")}
          >
            <ListItemIcon>
              <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(5, "/manage-tables")}
          >
            <ListItemIcon>
              <TableChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Manage Tables" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(6, "/ppe-entry")}
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
      <div
        style={{
          flexGrow: 1,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div className="header-container">
          <h1>Item History</h1>
          <p className="text">
            Generate and View Inventory, Issuance, Inspections, and Status
            Reports
          </p>
        </div>
        <TextInput/>


        <StyledTableContainer component={Paper}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <StyledTableCell isHeader={true}>Date</StyledTableCell>
            <StyledTableCell isHeader={true}>Unit</StyledTableCell>
            <StyledTableCell isHeader={true}>Original Quantity</StyledTableCell>
            <StyledTableCell isHeader={true}>Counted Quantity</StyledTableCell>
            <StyledTableCell isHeader={true}>Status</StyledTableCell>
            <StyledTableCell isHeader={true}>Remarks</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell>12/13/9</StyledTableCell>
            <StyledTableCell>098</StyledTableCell>
            <StyledTableCell>9</StyledTableCell>
            <StyledTableCell>8</StyledTableCell>
            <StyledTableCell>Broken</StyledTableCell>
            <StyledTableCell>4567890</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledTableContainer>
      </div>
    </div>
  );
}


export default Item_history;