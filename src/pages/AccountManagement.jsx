import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"; // Import Edit and Delete Icons
import Header from "../components/Header/Header.jsx";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const drawerWidth = 240;

function AccountManagement() {

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

  const handleAddAccount = () => {
    navigate('/add-account')
  }

    // Add these functions to handle edit and delete actions
  const handleEdit = (account) => {
    console.log("Editing account:", account);
    // Implement navigation or modal for editing the account
  };

  const handleDelete = (id) => {
    console.log("Deleting account with ID:", id);
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
  };


  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch account data from the backend on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://ppemanagement.andrieinthesun.com/retrieve_accounts.php");
        setAccounts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Filtered accounts based on search term
  const filteredAccounts = accounts.filter((account) =>
    `${account.lastname} ${account.firstname} ${account.middlename || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      {/* Header */}
      <Header />

      {/* Sidebar Drawer */}
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
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(4, "/inventory")}
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
            style={{ color: "#0F1D9F"}}
            onClick={() => handleListItemClick(6, "/account-management")}
          >
            <ListItemIcon>
              <PeopleIcon style={{ color: "#0F1D9F"}}/>
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
            onClick={() => handleListItemClick(6, "/profile")}
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
      <div style={{ flexGrow: 1, padding: "80px 20px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px", color:"#0F1D9F" }}>
          Account Management
        </Typography>

        {/* Search Bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <TextField
            variant="outlined"
            placeholder="Search accounts..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginRight: "10px", flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#0F1D9F", color: "white" }}
            onClick={handleAddAccount}
          >
            Add Account
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} sx={{ marginLeft: "10px" }}>
            Print
          </Button>
          <IconButton>
            <FilterIcon />
          </IconButton>
        </div>

        {/* Accounts Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#0F1D9F" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0F1D9F" }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0F1D9F" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0F1D9F" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#0F1D9F" }}>Actions</TableCell> {/* New Actions Column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.user_id}>
                  <TableCell>{account.user_id}</TableCell>
                  <TableCell>
                    {`${account.lastname}, ${account.firstname} ${account.middlename || ""}`}
                  </TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>{account.department}</TableCell>
                  <TableCell>
                    {/* Edit Button */}
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(account)}
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(account.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AccountManagement;
