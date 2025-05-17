import React, { useState, useEffect } from "react";
import "./Purchase_list.css";
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
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Header from "../components/Header/Header.jsx";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Notifications } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const drawerWidth = 240;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: "10px",
  marginLeft: "30px",
  marginRight: "20px",
  width: "100%",
  maxWidth: "1130px",
  overflowY: "auto",
  borderRadius: "10px",
  border: "1px solid #979797",
}));

const StyledTableDataCell = styled(TableCell)(({ isHeader }) => ({
  fontWeight: isHeader ? "bold" : "normal",
  fontSize: isHeader ? "16px" : "14px",
  color: isHeader ? "#0f1d9f" : "#333333",
  textAlign: "center",
  padding: "10px 16px",
  borderBottom: isHeader ? "2px solid #979797" : "none",
}));

const PurchaseList = () => {
  const navigate = useNavigate();

  const [isReportMenuOpen, setReportMenuOpen] = useState(false);
  const [purchaseDataList, setPurchaseDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get("http://ppemanagement.andrieinthesun.com/retrieve_purchase_request.php");
        setPurchaseDataList(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
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
        navigate('/');
      }
    });
  };

  const toggleReportMenu = () => {
    setReportMenuOpen((prev) => !prev);
  };

  const handleViewRequest = (reqId) => {
    navigate(`/purchase-list-view/${reqId}`);
  };

  // Filtering logic
  const filteredData = purchaseDataList.filter((row) => {
    const reqId = (row.req_id || "").toString();
    const requestedBy = (row.requestedBy || "").toString();
    const department = (row.department || "").toString();
    const status = (row.status || "").toString();

    // Search filter
    const matchesSearch =
      reqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter ? status === statusFilter : true;

    // Department filter
    const matchesDept = departmentFilter ? department === departmentFilter : true;

    return matchesSearch && matchesStatus && matchesDept;
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
          <ListItem button onClick={() => handleListItemClick("/home-1")}>
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
          <ListItem button onClick={() => handleListItemClick("/purchase-list")} style={{ color: "#0F1D9F" }}>
            <ListItemIcon>
              <AssignmentIcon style={{ color: "#0F1D9F" }} />
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
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32 }}
                onClick={() => handleListItemClick("/inventory")}
              >
                <ListItemIcon>
                  <AssignmentIcon />
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
              <TableChartIcon />
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
        {/* Header Container */}
        <div className="header-container">
          <h1>Purchase Request List</h1>
          <p className="text">View and manage all purchase requests</p>
        </div>

        {/* Search and Dropdowns */}
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

          {/* Status Dropdown */}
          <FormControl variant="outlined" className="dropdown" style={{ maxWidth: "160px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          {/* Department Dropdown */}
          <FormControl variant="outlined" className="dropdown" style={{ maxWidth: "160px" }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="General Service Office (GSO)">General Service Office (GSO)</MenuItem>
              <MenuItem value="MPDO">MPDO</MenuItem>
              <MenuItem value="MAYOR'S OFFICE">MAYOR'S OFFICE</MenuItem>
              <MenuItem value="ENGINEERING">ENGINEERING</MenuItem>
              <MenuItem value="ACCOUNTING">ACCOUNTING</MenuItem>
            </Select>
          </FormControl>
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
                  <StyledTableDataCell key={header} isHeader>
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
                      {row.status === "Pending" && (
                        <>
                          <IconButton color="success">
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton color="error">
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
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

export default PurchaseList;