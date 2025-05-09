import React, { useState } from "react"; 
import "./Inventory_report1.css"; 
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse 
} from "@mui/material";
import Header from "../components/Header/Header.jsx"; 
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const drawerWidth = 240;

function Inventory_report1() {
    const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected menu item
  const [isReportMenuOpen, setReportMenuOpen] = useState(true); // Track sub-menu visibility

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


  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedOption, setSelectedOption] = useState(""); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "16px",
    color: "#0f1d9f", 
    borderBottom: `2px solid #979797`,
    textAlign: "center",
    border : "1px solid #979797",
  }));
  
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: "10px",
    marginLeft: "30px", 
    marginRight: "20px",
    width: "100%",
    maxWidth: "1120px",
    borderRadius: "10px",
    border: "1px solid #979797",
    overflowY: "auto",
  }));
  
  const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "normal", 
    fontSize: "12px",
    textAlign: "center",
    border:"2px solid #979797"
  }));

  return (
    <div style={{ display: "flex" }}>
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
            onClick={() => handleListItemClick(0, "/home")}
          >
            <ListItemIcon>
              <HomeIcon/>
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
              <AccountCircleIcon/>
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(5, "/ppe-entry")}
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
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", // Enables vertical scrolling
          overflowX: "hidden", // Prevents horizontal scrolling
          height: "100vh",
          width: "100%", 
          maxWidth: "1200px",
          margin: "0 auto", 
          padding: "10px", 
        }}
      >

      <div style={{ flexGrow: 1, padding: "10px" }}>
        <div className="header-container">
          <h1>Inventory Reports</h1>
          <p className="text">Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
        </div>

        <div className="search-dropdown-container" >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            InputProps={{
              startAdornment: (
                <SearchIcon className="search-icon" />
              ),
            }}
          />

          <FormControl variant="outlined" className="dropdown" >
            <InputLabel>Filter</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleDropdownChange}
              label="Filter"
            >
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        </div>

        <StyledTableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableDataCell>-</StyledTableDataCell>
                <StyledTableDataCell>-</StyledTableDataCell>
                <StyledTableDataCell>
                  <button
                    style={{
                      backgroundColor: "#0F1D9F",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => alert("View button clicked!")}
                  >
                    View
                  </button>
                </StyledTableDataCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div> 
    </div>  
</div>  

  );
}

export default Inventory_report1;