import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  TableChart as TableChartIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx"; // Import the Header component
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import { Search, FilterList, Add, Print } from "@mui/icons-material";
import Swal from "sweetalert2";

const drawerWidth = 240;

function Department() {
    const navigate = useNavigate();
    const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  
    const toggleReportMenu = () => {
      setReportMenuOpen((prevOpen) => !prevOpen);
    };
  
    const handleListItemClick = (path) => {
      navigate(path);
    };

  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false); // State for Add Department Modal
  const [newDepartment, setNewDepartment] = useState({ name: "", status: "Active" }); // State for new department

  const [firstName, setFirstName] = useState("");
  const [userRole, setUserRole] = useState("");
  
    useEffect(() => {
      const storedFirstName = localStorage.getItem("firstName");
      const storeduserRole = localStorage.getItem("userRole");
      if (storedFirstName || storeduserRole) {
          setFirstName(storedFirstName);
          setUserRole(storeduserRole);
      } else {
          navigate("/login"); // Redirect to login if no first name is found
      }

        if (storeduserRole === "DEPARTMENT HEAD")  {
          navigate("/dh-home-1")
        }

        else if (storeduserRole === "CUSTODIAN") {
          navigate("/ctn-home-1")
        }

        else if (storeduserRole === "ADMIN") {
          navigate("/department")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://ppemanagement.andrieinthesun.com/getDepartments.php");
        const data = await response.json();
        if (data.success) {
          setDepartments(data.departments);
        } else {
          console.error("Failed to fetch departments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  // Filter departments based on search query
  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add Department Modal Open/Close
  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  // Handle input change for new department
  const handleNewDepartmentChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Department
  const handleAddDepartment = async () => {
    try {
      const response = await fetch("http://ppemanagement.andrieinthesun.com/addDepartment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDepartment),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire("Success!", "Department added successfully.", "success");
        setDepartments((prev) => [...prev, data.department]); // Add new department to the list
        handleAddModalClose(); // Close the modal
        setNewDepartment({ name: "", status: "Active" }); // Reset the form
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      Swal.fire("Error!", "An error occurred. Please try again later.", "error");
    }
  };

  return (
    <div style={{ display: "flex" }}>
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
          <ListItem button onClick={() => handleListItemClick("/home-1")} >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/purchase-request")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/purchase-list")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase List" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/inspection")}>
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
          <ListItem button onClick={() => handleListItemClick("/account-management")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/department")} style={{ color: "#0F1D9F"}}>
            <ListItemIcon>
              <TableChartIcon style={{ color: "#0F1D9F"}}/>
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
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Typography variant="h4" style={{ color: "#0F1D9F", marginBottom: "20px" }}>
          Department Management
        </Typography>

        {/* Search and Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <TextField
            placeholder="Quick search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search style={{ marginRight: "8px", color: "#666" }} />,
            }}
            style={{ width: "300px" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              style={{ backgroundColor: "#0F1D9F", color: "white" }}
              onClick={handleAddModalOpen}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              style={{ borderColor: "#0F1D9F", color: "#0F1D9F" }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              style={{ borderColor: "#0F1D9F", color: "#0F1D9F" }}
            >
              Filter
            </Button>
          </div>
        </div>

        {/* Departments Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.id}</TableCell>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{department.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{ marginRight: "10px", color: "#0F1D9F", borderColor: "#0F1D9F" }}
                        onClick={() => console.log("View department:", department.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteDeactivate(department.id)}
                      >
                        Delete/Deactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No departments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Department Modal */}
        <Dialog open={isAddModalOpen} onClose={handleAddModalClose}>
          <DialogTitle>Add Department</DialogTitle>
          <DialogContent>
            <TextField
              label="Department Name"
              name="name"
              value={newDepartment.name}
              onChange={handleNewDepartmentChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Status"
              name="status"
              value={newDepartment.status}
              onChange={handleNewDepartmentChange}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddModalClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddDepartment} color="primary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      
    </div>
  );
}

export default Department;