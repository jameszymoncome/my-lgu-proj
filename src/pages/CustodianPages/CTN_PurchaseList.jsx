import React, { useState , useEffect} from "react";
import "../Purchase_list.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Collapse, IconButton } from "@mui/material";
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
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;


const CTN_PurchaseList = () => {
    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(null); // Track selected menu item
    const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility
    const [purchaseDataList, setPurchaseDataList] = useState([])

    useEffect(() => {
      const userId = localStorage.getItem("userId"); // or whatever key you use for user id
      if (!userId) return;
      const fetchPurchaseData = async () => {
        try {
          const response = await axios.get(`http://ppemanagement.andrieinthesun.com/ctn_retrieve_purchase_request.php?user_id=${userId}`);
          setPurchaseDataList(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
          setPurchaseDataList([]); // fallback to empty array on error
          console.error("Error fetching purchase data:", error);
          alert("Failed to fetch purchase data.");
        }
      };

      fetchPurchaseData();
    }, []);

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

    const handleInvClick = () => {
    navigate("/inventory")
  }

  const handleParIcsClick = () => {
    navigate("/par-ics")
  }

  const handleScanClick = () => {
    navigate("/home")
  }

  const handleAddItemClick = () => {
    navigate("/ppe-entry")
  }
  const handleViewRequest = (reqId) => {
    navigate(`/ctn-purchase-list-view/${reqId}`);
  };

  const handleUpdateRequest = async (reqId, status) => {
    try{
      const response = await axios.post("http://ppemanagement.andrieinthesun.com/requestStatus.php", {
        reqId: reqId,
        status: status,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: `This request has been ${status === "Approved" ? "approved" : "rejected"}.`,
          text: `Request No.: ${response.data.reqId}`,
          confirmButtonText: "OK",
        });
      } else {
        alert("Failed to submit the request: " + response.data.message);
      }
    } catch (error) {
      
    }
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
                <ListItem button onClick={() => handleListItemClick("/ctn-home-1")} >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/ctn-purchase-request")} >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Purchase Request" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/ctn-purchase-list")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <AssignmentIcon style={{ color: "#0F1D9F"}}/>
                  </ListItemIcon>
                  <ListItemText primary="Purchase List" />
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
                      onClick={() => handleListItemClick("/ctn-parics1")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/ctn-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="Inventory" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button onClick={() => handleListItemClick("/ctn-notification")}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notification" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/ctn-profile")}>
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

        <div style={{ flexGrow: 1, padding: "80px 40px" }}>
            <div className="miniHead">
                <h1 className="miniHeadText">Purchase Request List</h1>
                <input type="search" placeholder="Search..." className="searchBar" />
            </div>

            <TableContainer style={{ marginTop: "40px", width: "100%" }}>
                <Table size="small" sx={{ borderCollapse: "collapse" }}>
                <TableHead>
                    <TableRow>
                    {["Purchase Request No.", "Date", "Requested By", "Department", "Total Cost", "Status", "Actions"].map((header, idx) => (
                        <TableCell
                        key={idx}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            borderBottom: "1px solid #000",
                            borderTop: "1px solid #000",
                            width: "14.28%",
                            textAlign: "center",
                        }}
                        >
                        {header}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseDataList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.req_id}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.requestedBy}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.department}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.total_amount}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>{row.status}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", borderBottom: "1px solid #000", textAlign: "center" }}>
                        <IconButton color="primary" onClick={() => handleViewRequest(row.req_id)}>
                          <VisibilityIcon />
                        </IconButton>
                        {row.status === "Pending" && (
                          <>
                            <IconButton color="success" onClick={() => handleUpdateRequest(row.req_id, "Approved")}>
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleUpdateRequest(row.req_id, "Rejected")}>
                              <CancelIcon />
                            </IconButton>
                          </>
                        )}
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

export default CTN_PurchaseList;