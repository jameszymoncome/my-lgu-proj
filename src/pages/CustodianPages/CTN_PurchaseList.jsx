import React, { useState, useEffect } from "react";
import "../Purchase_list.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const drawerWidth = 240;

const StyledTableContainer = TableContainer;
const StyledTableDataCell = TableCell;

const CTN_PurchaseList = () => {
  const navigate = useNavigate();

  const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  const [purchaseDataList, setPurchaseDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get(
          `http://ppemanagement.andrieinthesun.com/ctn_retrieve_purchase_request.php?user_id=${userId}`
        );
        setPurchaseDataList(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        setPurchaseDataList([]);
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
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, Stay",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0F1D9F",
      customClass: {
        popup: "minimal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const toggleReportMenu = () => {
    setReportMenuOpen((prev) => !prev);
  };

  const handleViewRequest = (reqId) => {
    navigate(`/ctn-purchase-list-view/${reqId}`);
  };

  // Searching logic
  const filteredData = purchaseDataList.filter((row) => {
    const reqId = (row.req_id || "").toString();
    const requestedBy = (row.requestedBy || "").toString();
    const department = (row.department || "").toString();
    return (
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <ListItem button onClick={() => handleListItemClick("/ctn-home-1")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/ctn-purchase-request")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/ctn-purchase-list")} style={{ color: "#0F1D9F" }}>
            <ListItemIcon>
              <AssignmentIcon style={{ color: "#0F1D9F" }} />
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
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32 }}
                onClick={() => handleListItemClick("/ctn-inventory")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
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

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        <div className="header-container">
          <h1>Purchase Request List</h1>
          <p className="text">View and manage all purchase requests</p>
        </div>

        {/* Search Bar */}
        <div
          className="search-dropdown-container"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ maxWidth: "300px" }}
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />,
            }}
          />
        </div>

        {/* Data Table */}
        <StyledTableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {[
                  "Purchase Request No.",
                  "Date",
                  "Requested By",
                  "Department",
                  "Total Cost",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <StyledTableDataCell key={header} style={{ fontWeight: "bold", fontSize: "16px", color: "#0f1d9f", textAlign: "center" }}>
                    {header}
                  </StyledTableDataCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No purchase requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <StyledTableDataCell>{row.req_id}</StyledTableDataCell>
                    <StyledTableDataCell>{row.date}</StyledTableDataCell>
                    <StyledTableDataCell>{row.requestedBy}</StyledTableDataCell>
                    <StyledTableDataCell>{row.department}</StyledTableDataCell>
                    <StyledTableDataCell>{row.total_amount}</StyledTableDataCell>
                    <StyledTableDataCell>{row.status}</StyledTableDataCell>
                    <StyledTableDataCell>
                      <IconButton color="primary" onClick={() => handleViewRequest(row.req_id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </StyledTableDataCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </div>
    </div>
  );
};

export default CTN_PurchaseList;