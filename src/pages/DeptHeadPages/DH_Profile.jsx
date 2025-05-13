import React, { useState, useEffect } from "react";
import "../PPE_Entry.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  Button,
  Collapse,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import Swal from 'sweetalert2';
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;

function DH_Profile() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  
  const handleListItemClick = (path) => {
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

  const [userID, setuserID] = useState();
  
    useEffect(() => {
      const storeduserID = localStorage.getItem("userId");
      if (storeduserID) {
          setuserID(storeduserID);
      } else {
          navigate("/login"); // Redirect to login if no first name is found
      }
  }, [navigate]);
  
  const [profile, setProfile] = useState({
    lastname: "",
    firstname: "",
    middlename: "",
    suffix: "",
    email: "",
    contactNumber: "",
    username: "",
    role: "",
    department: "",
  });

  const departments = [
    "GSO",
    "MAYOR'S OFFICE",
    "ACCOUNTING",
    "ENGINEERING",
    "MPDO",
  ];
  
  const roles = ["ADMIN", "DEPARTMENT HEAD", "CUSTODIAN"];
  
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Profile Data
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://ppemanagement.andrieinthesun.com/profile.php?user_id=${userID}`);
      if (response.data.success) {
        setProfile(response.data.data); // Set the profile data
      } else {
        Swal.fire("Error!", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire("Error!", "Failed to fetch profile data.", "error");
    }
  };

  if (userID) {
    fetchProfile();
  }
}, [userID]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Update Profile
  const handleUpdate = async () => {
  try {
    const response = await axios.put("http://ppemanagement.andrieinthesun.com/edit_profile.php", {
      user_id: userID,
      ...profile, // Spread the profile object to send all fields
    });

    if (response.data.success) {
      Swal.fire("Success!", response.data.message, "success");
      setIsEditing(false); // Exit editing mode
    } else {
      Swal.fire("Error!", response.data.message, "error");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire("Error!", "Failed to update profile.", "error");
  }
};

  // Delete Profile
  const handleDelete = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`http://ppemanagement.andrieinthesun.com/profile.php?user_id=${userID}`);
        if (response.data.success) {
          Swal.fire("Deleted!", response.data.message, "success");
          navigate("/login"); // Redirect to login after deletion
        } else {
          Swal.fire("Error!", response.data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        Swal.fire("Error!", "Failed to delete profile.", "error");
      }
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
                        <ListItem button onClick={() => handleListItemClick("/dh-home-1")} >
                          <ListItemIcon>
                            <HomeIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={() => handleListItemClick("/dh-purchase-request")} >
                          <ListItemIcon>
                            <AssignmentIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Purchase Request" />
                        </ListItem>
                        <ListItem button onClick={() => handleListItemClick("/dh-purchase-list")} >
                          <ListItemIcon>
                            <AssignmentIcon />
                          </ListItemIcon>
                          <ListItemText primary="Purchase List" />
                        </ListItem>
                        <ListItem button onClick={() => handleListItemClick("/dh-inspection")}>
                          <ListItemIcon>
                            <ReportIcon />
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
                              onClick={() => handleListItemClick("/dh-parics1")}
                            >
                              <ListItemIcon>
                                              <AssignmentIcon />
                                            </ListItemIcon>
                              <ListItemText primary="PAR & ICS" />
                            </ListItem>
                            <ListItem
                              button
                              style={{ paddingLeft: 32 }}
                              onClick={() => handleListItemClick("/dh-inventory")}
                            >
                              <ListItemIcon>
                                              <AssignmentIcon/>
                                            </ListItemIcon>
                              <ListItemText primary="Inventory" />
                            </ListItem>
                          </List>
                        </Collapse>
                        <ListItem button onClick={() => handleListItemClick("/dh-notification")}>
                          <ListItemIcon>
                            <Notifications />
                          </ListItemIcon>
                          <ListItemText primary="Notification" />
                        </ListItem>
                        <ListItem button onClick={() => handleListItemClick("/dh-profile")} style={{ color: "#0F1D9F"}}>
                          <ListItemIcon>
                            <AccountCircleIcon style={{ color: "#0F1D9F"}}/>
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

      {/* Profile Form */}
      <div style={{ padding: "2rem", backgroundColor: "#fff", flex: 1 }}>
        <Typography variant="h4" gutterBottom style={{ color: "#0F1D9F" }}>
          Profile
        </Typography>
        <form style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {Object.keys(profile).map((key) => (
            key !== "role" && key !== "department" ? (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={profile[key]}
                onChange={handleChange}
                style={{ flex: "1 1 45%" }}
                disabled={!isEditing}
              />
            ) : null
          ))}
        </form>

        {/* Role and Department */}
        <Typography variant="h6" gutterBottom style={{ marginTop: "2rem", color: "#0F1D9F" }}>
          Department and Role
        </Typography>
        <div style={{ display: "flex", gap: "2rem" }}>
          <FormControl style={{ flex: "1 1 45%" }}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={profile.role}
              onChange={handleChange}
              disabled={!isEditing}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ flex: "1 1 45%" }}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={profile.department}
              onChange={handleChange}
              disabled={!isEditing}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              style={{ marginTop: "2rem" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              style={{ marginLeft: "1rem", marginTop: "2rem" }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "2rem" }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              style={{ marginLeft: "1rem", marginTop: "2rem" }}
            >
              Delete Profile
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default DH_Profile;
