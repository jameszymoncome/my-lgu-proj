import React, { useState } from "react";
import "./ManageTables.css"; // Custom styles
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Toolbar, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import Header from "../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const drawerWidth = 240;

function ManageTables() {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
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
    setReportMenuOpen((prevOpen) => !prevOpen);
  };

  // Sample table data
  const [tables, setTables] = useState([
    { id: 1, name: "Assets", status: "Active" },
    { id: 2, name: "Issued Items", status: "Inactive" },
    { id: 3, name: "Inspection Records", status: "Active" },
  ]);

  const handleEdit = (id) => {
    console.log(`Edit table with ID: ${id}`);
  };

  const handleDelete = (id) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
    console.log(`Deleted table with ID: ${id}`);
  };

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
          <ListItem button onClick={() => handleListItemClick(0, "/home")}>
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(1, "/ppe-entry")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="PPE Entry Form" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(2, "/inven-inspect")}>
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Inspection" />
          </ListItem>
          {/* Collapsible Report Sub-Menu */}
          <ListItem button onClick={toggleReportMenu}>
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Records" />
            {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                style={{ paddingLeft: 32 }}
                onClick={() => handleListItemClick(3, "/par-ics")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32 }}
                onClick={() => handleListItemClick(4, "/inventory")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => handleListItemClick(4, "/account-management")}
          >
            <ListItemIcon>
              <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => handleListItemClick(5, "/manage-tables")} 
            style={{ color:"#0F1D9F"}}>
            <ListItemIcon>
              <TableChartIcon  style={{ color: "#0F1D9F" }} />
            </ListItemIcon>
            <ListItemText primary="Manage Tables" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(6, "/profile")}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => handleLogout(7, "/")}>
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
          padding: "80px 20px",
        }}
      >
        <header>
          <h1>Manage Tables</h1>
          <input type="search" placeholder="Search tables" className="search-bar" />
        </header>

        {/* Table */}
        <TableContainer
          component={Paper}
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Table Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{table.id}</TableCell>
                  <TableCell>{table.name}</TableCell>
                  <TableCell>{table.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "10px" }}
                      onClick={() => handleEdit(table.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(table.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ManageTables;
