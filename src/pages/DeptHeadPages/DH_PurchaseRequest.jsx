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
  Autocomplete,
  FormControl,
} from "@mui/material";
import "../PurchaseRequest.css";
import axios from "axios";
import Swal from "sweetalert2";
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
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;

function DH_PurchaseRequest() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [department, setDepartment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [requestedName, setRequestedName] = useState("");
  const [receiverOptions, setReceiverOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState("");
  const [userLogRole, setUserLogRole] = useState("");
  const [userId, setUserId] = useState("");
  const [requestNo, setRequestNo] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected menu item
  const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility
  const [requestedBy, setRequestedBy] = useState("");

  const handleListItemClick = (path) => {
      navigate(path);
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
  
    const toggleReportMenu = () => {
      setReportMenuOpen((prev) => !prev);
    };
  
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
    };

  // Fetch receiver options when the department changes
  useEffect(() => {
    const userLog = localStorage.getItem("userRole");
    const userIds = localStorage.getItem("userId");
    const depart = localStorage.getItem("userDepartment");
    const fullName = localStorage.getItem("userFullName");
    setUserLogRole(userLog);
    setUserId(userIds);
    
    if (userLog === "CUSTODIAN"){
      setDepartment(depart);
      setRequestedName({ full_name: fullName });
      setRequestedBy(userIds);
    }

    const fetchReceivers = async () => {
      try {
        const response = await axios.get(
          "http://ppemanagement.andrieinthesun.com/retrieve_users.php",
          {
            params: {
              role: "DEPARTMENT HEAD,CUSTODIAN",
              search: "",
              department: department, // Filter by department if available
            },
          }
        );
        setReceiverOptions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching receivers:", error);
        alert("Failed to fetch receiver options.");
      }
    };

    fetchReceivers();
  }, [department]);

  // Fetch Request No. from the backend
  useEffect(() => {
    const fetchRequestNo = async () => {
      try {
        const response = await axios.get(
          "http://ppemanagement.andrieinthesun.com/getRequestNo.php"
        );
        if (response.data.success) {
          setRequestNo(response.data.requestNo); // Set the Request No.
        } else {
          console.error("Failed to fetch Request No.");
        }
      } catch (error) {
        console.error("Error fetching Request No.:", error);
      }
    };

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setCurrentDate(formattedDate);

    fetchRequestNo();
  }, []);


  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      quantity: "",
      description: "",
      unitPrice: "",
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;


    // Update total cost for the item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItems(updatedItems);
  };

  const handleSaveDraft = async () => {
    try {
      const response = await axios.post("http://ppemanagement.andrieinthesun.com/storeRequestDraft.php", {
        items: items,
        purpose: purpose,
        userLogRole: userLogRole,
        userId: userId,
        requestNo: requestNo,
        requestedBy: requestedBy,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Request submitted successfully!",
          text: `Request No.: ${response.data.custom_id}`,
          confirmButtonText: "OK",
        });
      } else {
        alert("Failed to submit the request: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting for approval:", error);
      alert("Failed to submit for approval.");
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      const response = await axios.post("http://ppemanagement.andrieinthesun.com/storeRequest.php", {
        items: items,
        purpose: purpose,
        userLogRole: userLogRole,
        userId: userId,
        requestNo: requestNo,
        requestedBy: requestedBy,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Request submitted successfully!",
          text: `Request No.: ${response.data.custom_id}`,
          confirmButtonText: "OK",
        });
      } else {
        alert("Failed to submit the request: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting for approval:", error);
      alert("Failed to submit for approval.");
    }
};

  return (
    <div style={{display: "flex"}}>
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
                <ListItem button onClick={() => handleListItemClick("/dh-home-1")} >
                  <ListItemIcon>
                    <HomeIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-purchase-request")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <AssignmentIcon style={{ color: "#0F1D9F"}}/>
                  </ListItemIcon>
                  <ListItemText primary="Purchase Request" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-purchase-list")}>
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
                                      <AssignmentIcon/>
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
                <ListItem button onClick={() => handleListItemClick("/dh-profile")}>
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
      <div style={{padding: "20px", marginTop: "3.5rem" }}>
        <h1 style={{ color: "#0F1D9F" }}>Purchase Request</h1>
        <p style={{ color: "#666" }}>Record of Property or Equipment Issued</p>

        {/* Form Fields */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <TextField
            label="Date"
            type="date"
            value={currentDate}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
          />
          <TextField
            label="Request No."
            value={requestNo}
            fullWidth
            disabled
          />
          <FormControl fullWidth>
            <Autocomplete
              options={receiverOptions} // List of names for the search
              value={requestedName} // Current selected value
              onChange={(event, newValue) => {
                setRequestedName(newValue); // Update the state with the selected value
                if (newValue) {
                  setDepartment(newValue.department); // Update department with the selected user's department
                  setUserRoles(newValue.role);
                  setRequestedBy(newValue.user_id); // Update requestedBy with the selected user's full name
                }
              }}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                  option.full_name
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                )
              }
              getOptionLabel={(option) => option.full_name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Requested By"
                  fullWidth
                />
              )}
              disabled={userRoles === "CUSTODIAN"}
            />
          </FormControl>
          <TextField
            label="Department"
            value={department}
            fullWidth
            disabled
          />
        </div>

        {/* Items Table */}
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item No.</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Article/Description</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", parseInt(e.target.value))
                      }
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(index, "description", e.target.value)
                      }
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleInputChange(index, "unitPrice", parseFloat(e.target.value))
                      }
                      fullWidth
                    />
                  </TableCell>

                  <TableCell>{item.total.toLocaleString()}</TableCell>
                  
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        setItems(items.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          style={{
            backgroundColor: "#0F1D9F",
            color: "white",
            marginBottom: "20px",
          }}
          onClick={handleAddItem}
        >
          + Add More Item
        </Button>

        {/* Purpose Field */}
        <TextField
          label="Purpose"
          multiline
          rows={4}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          fullWidth
          style={{ marginBottom: "20px" }}
        />

        {/* Total Amount */}
        <h3 style={{ textAlign: "right", marginBottom: "20px" }}>
          Total Amount:{" "}
          {items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
        </h3>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <Button
            variant="outlined"
            style={{
              borderColor: "#0F1D9F",
              color: "#0F1D9F",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#0F1D9F",
              color: "white",
            }}
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#0F1D9F",
              color: "white",
            }}
            onClick={handleSubmitForApproval}
          >
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DH_PurchaseRequest;