import React, { useState, useEffect } from "react";
import "../Purchase_list.css";
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
  Tabs,
  Tab,
  Modal,
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
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;

const DH_Notification = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  const [purchaseDataList, setPurchaseDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get("http://localhost/myServer/retrieve_purchase_request.php");
        setPurchaseDataList(response.data.data);
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

  const notifications = [
    { type: "Request", title: "Your request is approved", timestamp: "Mon, Mar 2, 3:07 PM", details: "We are pleased to inform you that your request for an office chair has been approved and is currently being processed by the General Services Office (GSO)." },
    { type: "Inspection", title: "Reminder", timestamp: "Mon, Mar 2, 12:54 PM", details: "This is a reminder for your scheduled inspection." },
    { type: "Request", title: "Your request is pending", timestamp: "Tue, Mar 3, 10:15 AM", details: "Your request is still pending approval." },
  ];

  const filteredData = notifications.filter((notification) => {
    if (activeTab === 0) return true; 
    if (activeTab === 1) return notification.type === "Inspection"; 
    if (activeTab === 2) return notification.type === "Request"; 
    return false;
  });

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRowClick = (notification) => {
    setSelectedNotification(notification);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotification(null);
  };

  const handleListItemClick = (path) => {
      navigate(path);
    };

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
                <ListItem button onClick={() => handleListItemClick("/dh-notification")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notification" style={{ color: "#0F1D9F"}}/>
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

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: "40px", marginTop: "40px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h4" sx={{ color: "#0F1D9F", fontWeight: "bold" }}>
              Notification
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#0F1D9F", marginBottom: 2 }}>
              Record of Property or Equipment Issued
            </Typography>
          </div>
        </Box>
        <hr style={{ border: "1px solid rgba(39, 50, 64, 0.3)" }} />

        {/* Search Bar */}
        <Box display="flex" alignItems="center" marginBottom={2} marginTop={3}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, maxWidth: "px" }}
          />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            marginBottom: 1,
            "& .MuiTab-root": {
              color: "#0F1D9F",
            },
            "& .Mui-selected": {
              color: "#0F1D9F",
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#0F1D9F",
            },
          }}
        >
          <Tab label="All" sx={{ fontWeight: "bold" }} />
          <Tab label="Inspection" sx={{ fontWeight: "bold" }} />
          <Tab label="Request" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: "none" }}>
          <Table sx={{ border: "1px solid rgba(0, 0, 0, 0.2)" }}>
            <TableBody>
              {filteredData.map((notification, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() => handleRowClick(notification)}
                >
                  <TableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      padding: "16px",
                      fontSize: "16px",
                    }}
                  >
                    {/* Icon */}
                    <Box sx={{ marginRight: 2 }}>
                      {notification.type === "Request" ? (
                        <AssignmentIcon sx={{ color: "#0F1D9F" }} />
                      ) : (
                        <CheckCircleIcon sx={{ color: "#0F1D9F" }} />
                      )}
                    </Box>

                    {/* Notification Content */}
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0F1D9F" }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                        {notification.timestamp}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedNotification && (
              <>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0F1D9F", marginBottom: 2 }}>
                  {selectedNotification.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#0F1D9F", marginBottom: 1 }}>
                  {selectedNotification.timestamp}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.8)" }}>
                  {selectedNotification.details}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default DH_Notification;