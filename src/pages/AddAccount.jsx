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
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const drawerWidth = 240;

function AddAccount() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const handleBackClick = () => {
    navigate("/account-management");
  };

  const toggleReportMenu = () => {
    setReportMenuOpen((prevOpen) => !prevOpen); // Toggle sub-menu visibility
  };

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
      const fetchDepartments = async () => {
        try {
          const response = await fetch("http://ppemanagement.andrieinthesun.com/getDepartmentsDD.php");
          const data = await response.json();
          if (data.success) {
            setDepartments(data.departments);
            console.log("Departments fetched successfully:", data.departments);
          } else {
            console.error("Failed to fetch departments:", data.message);
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };
  
      fetchDepartments();
    }, []);

  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    middlename: "",
    suffix: "",
    email: "",
    contactNumber: "",
    username: "",
    password: "",
    role: "",
    department: "",
  });

  const roles = ["ADMIN", "DEPARTMENT HEAD", "CUSTODIAN"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (Object.values(formData).some((field) => !field)) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("http://ppemanagement.andrieinthesun.com/add_account.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account saved successfully!");
        handleClear();
      } else {
        alert(data.message || "Failed to save account.");
      }
    } catch (error) {
      console.error("Error saving account:", error);
      alert("Error saving account. Please try again.");
    }
  };

  const handleClear = () => {
    setFormData({
      lastname: "",
      firstname: "",
      middlename: "",
      suffix: "",
      email: "",
      contactNumber: "",
      username: "",
      password: "",
      role: "",
      department: "",
    });
  };

  const handleLogout = () => {
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
          navigate('/'); // Redirect to login page
        } else {
          // Optional: Handle "No" button click (if needed)
          console.log("User chose to stay logged in.");
        }
      });
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
                <ListItem button onClick={() => handleListItemClick("/home-1")}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/purchase-request")} >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Purchase Request" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/purchase-list")} >
                  <ListItemIcon>
                    <AssignmentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Purchase List" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/inspection")}  >
                  <ListItemIcon>
                    <ReportIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Inspection" />
                </ListItem>
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
                      onClick={() => handleListItemClick("/par-ics")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="Inventory" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button onClick={() => handleListItemClick("/account-management")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <PeopleIcon style={{ color: "#0F1D9F"}}/>
                  </ListItemIcon>
                  <ListItemText primary="Account Management" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/department")}>
                                            <ListItemIcon>
                                              <TableChartIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Department" />
                                          </ListItem>
                <ListItem button onClick={() => handleListItemClick("/notification")}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notification" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Drawer>

      <div style={{ flexGrow: 1, padding: "2rem", backgroundColor: "#f5f5f5", marginTop: "4.2rem" }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#0F1D9F" }}>
          Add Account
        </Typography>
        <form style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "20px" }}>
          <TextField
            label="Lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            style={{ flex: "1 1 20%" }}
          />
          <TextField
            label="Firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            style={{ flex: "1 1 20%" }}
          />
          <TextField
            label="Middlename"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            style={{ flex: "1 1 20%" }}
          />
          <TextField
            label="Suffix"
            name="suffix"
            value={formData.suffix}
            onChange={handleChange}
            style={{ flex: "1 1 20%" }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ flex: "1 1 45%" }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={{ flex: "1 1 45%" }}
          />

          {/* Department Dropdown */}
          <FormControl style={{ flex: "1 1 45%" }}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.name} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Role Dropdown */}
          <FormControl style={{ flex: "1 1 45%" }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={handleBackClick} style={{ marginRight: "83rem", color: "#0F1D9F" }}>
            Back
          </Button>
          <Button variant="outlined" onClick={handleClear} style={{ marginRight: "1rem", color: "#0F1D9F"}}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            style={{ backgroundColor: "#0F1D9F", color: "#fff" }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddAccount;
