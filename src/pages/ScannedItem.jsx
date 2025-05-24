import React, { useState, useEffect } from "react";
import "./Purchase_list.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  AccountCircle as AccountCircleIcon,
  TableChart as TableChartIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Header from "../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { use } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import Swal from "sweetalert2";

const drawerWidth = 240;

const ScannedItem = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  const [purchaseDataList, setPurchaseDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [scanItems, setScanItems] = useState([]);

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
          navigate("/scanned-item")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  useEffect(() => {
    const userdRole = localStorage.getItem("userRole");
    const deptUser = localStorage.getItem("userDepartment");
    console.log("User Role:", deptUser);
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get("http://ppemanagement.andrieinthesun.com/getScannedItems.php", {
          params: {
            userdRole: userdRole,
            deptUser: deptUser,
          },
        });
        setScanItems(response.data.data);
        console.log("Fetched purchase data:", response.data.data);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
        alert("Failed to fetch purchase data.");
      }
    };

    fetchPurchaseData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = purchaseDataList.filter((row) =>
    row.req_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const toggleTable = () => {
    setIsTableExpanded((prev) => !prev);
  };

  const exportReport = () => {
    const content = `
        <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 20px;">
            <div style="text-align: center; font-size: 20px; font-weight: bold;">
                Scanned Report
            </div>

            <table border="1" cellspacing="0" cellpadding="10" style="width:100%; margin-top: 30px; border-collapse: collapse; font-size: 10px; text-align: center;">
                <thead>
                <tr>
                    <th>Property/Inventory Number</th>
                    <th>Description</th>
                    <th>Date Acquired</th>
                    <th>Department</th>
                    <th>Condition/Status</th>
                </tr>
                </thead>
                <tbody>
                ${scanItems.map(row => `
                    <tr>
                    <td>${row.entity_id}</td>
                    <td>${row.description}</td>
                    <td>${row.date_acquisition}</td>
                    <td>${row.department}</td>
                    <td>${row.status}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = content;

    html2pdf().set({
        margin: 0.5,
        filename: `${"ScannedReport".replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }

  return (
    <div style={{ display: "flex" }}>
      <Header />

      {/* Drawer */}
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
                <ListItem button onClick={() => handleListItemClick("/inspection")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <ReportIcon style={{ color: "#0F1D9F"}}/>
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

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: "40px", marginTop: "40px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h4" sx={{ color: "#0F1D9F", fontWeight: "bold" }}>
              Scanned Items
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#0F1D9F", marginBottom: 2 }}>
              Record of Property or Equipment Issued
            </Typography>
          </div>
          <Button variant="contained" color="primary" sx={{ height: "40px" }} onClick={exportReport}>
            Export Report
          </Button>
        </Box>
        <hr style={{ border: "1px solid rgba(39, 50, 64, 0.3)" }} />

        
        
        <TableContainer component={Paper} sx={{ marginTop: "20px", borderRadius: "8px", boxShadow: "none" }}>
            <Table>
                <TableHead>
                <TableRow>
                    {[
                    "Property/Inventory Number",
                    "Description",
                    "Date Acquired",
                    "Department",
                    "Condition/Status",
                    ].map((header, idx) => (
                    <TableCell
                        key={idx}
                        sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        }}
                    >
                        {header}
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {scanItems.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                    <TableCell sx={{ textAlign: "center" }}>{row.entity_id}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.description}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.date_acquisition}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.department}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{row.status}</TableCell>
                </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      
      </div>
    </div>
  );
};

export default ScannedItem;