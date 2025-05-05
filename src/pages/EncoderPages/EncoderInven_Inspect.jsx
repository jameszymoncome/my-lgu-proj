import React, { useState } from "react";
import "../Inven_Inspect.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Collapse } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const drawerWidth = 240;

const EncoderInven_Inspect = () => {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected menu item
  const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility
  const [selectedOption, setSelectedOption] = useState("");

  const options = ["Option 1", "Option 2", "Option 3"];
  const data = [
    { department: "ACCOUNTING", date: "2024-12-01", status: "Completed" },
    { department: "MPDO", date: "2024-12-02", status: "In Progress" },
    { department: "MAYOR'S OFFICE", date: "2024-12-03", status: "Completed" },
  ];

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
    setReportMenuOpen((prev) => !prev);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleViewRecord = () => {
    navigate("/inspec-scanner")
  }

  return (
    <div style={{ display: "flex" }}>
      <Header />

      {/* Drawer*/}
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
            onClick={() => handleListItemClick(0, "/home-encoder")}
          >
            <ListItemIcon>
              <HomeIcon  />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/encoder-ppeentry")}
          >
            <ListItemIcon>
              <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="PPE Entry Form" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/encoder-inveninspect")}
            style={{color: "#0F1D9F"}}
          >
            <ListItemIcon>
              <ReportIcon style={{ color: "#0F1D9F" }} />
            </ListItemIcon>
            <ListItemText primary="Inspection" />
          </ListItem>
          <ListItem button onClick={toggleReportMenu}>
            <ListItemIcon>
              <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Records" />
            {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(5, "/encoder-parics1")}
              >
                <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(4, "/encoder-invreport")}
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
            style={{ color: selectedIndex === 6 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleListItemClick(6, "/encoder-profile")}
          >
            <ListItemIcon>
              <AccountCircleIcon style={{ color: selectedIndex === 6 ? "#0F1D9F" : "inherit" }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            button
            style={{ color: selectedIndex === 8 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleLogout(7, "/")}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: "80px 40px" }}>
        <header>
          <div className="heads">
            <h1 style={{ color: "#0F1D9F" }}>Inventory Inspection</h1>
            <button style={{ color: "#0F1D9F" }} className="viewBTN" onClick={handleViewRecord}>View Records</button>
          </div>
        </header>

        {/* Dashboard */}
        <div className="dashBoards">
          {["Total offices", "Completed", "Pending", "Overdue"].map((item, idx) => (
            <div className="dashBoard_cards" key={idx}>
              <h4>{item}</h4>
              <h1>{[16, 34, 46, 34][idx]}</h1>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="miniHead">
          <input type="search" placeholder="Search..." className="searchBar" />
          <select className="dropdown" value={selectedOption} onChange={handleChange}>
            <option value="" disabled>
              Filters
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <TableContainer style={{ marginTop: "40px", width: "100%" }}>
          <Table size="medium" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["Department/Offices", "Date", "Status"].map((header, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      borderBottom: "1px solid #000",
                      borderTop: "1px solid #000",
                      width: "33.33%",
                      textAlign: "center",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell
                      key={idx}
                      sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default EncoderInven_Inspect;
