import React, { useState, useRef, useEffect} from "react";
import "../Inventory_report.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import PeopleIcon from "@mui/icons-material/People";
import { styled } from "@mui/system";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import axios from "axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

const drawerWidth = 240;

const buttonStyles = {
  backgroundColor: "#0F1D9F",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "10px",
};

const TextInput = () => (
  <div
    className="input-container"
    style={{
      display: "flex",
      gap: "20px",
      alignItems: "center",
      marginTop: "10px",
      justifyContent: "flex-start",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label htmlFor="entity-name" className="label">
        Entity Name:
      </label>
      <input
        type="text"
        id="entity-name"
        className="text-input"
        placeholder="Enter entity name"
      />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label htmlFor="fund-cluster" className="label">
        Fund Cluster:
      </label>
      <input
        type="text"
        id="fund-cluster"
        className="text-input"
        placeholder="Enter fund cluster"
      />
    </div>
  </div>
);


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


const StyledTableDataCell = styled(TableCell)(({ theme, isHeader }) => ({
  fontWeight: isHeader ? "bold" : "normal",
  fontSize: isHeader ? "16px" : "14px",
  color: isHeader ? "#0f1d9f" : "#333333",
  textAlign: "center",
  padding: "10px 16px",
  borderBottom: "2px solid #979797",
  borderLeft: "none",
  borderRight: "none",
}));


function DH_InventoryReport() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [years, setYears] = useState([]);
  const [userdRole, setUserdRole] = useState('');
  const [loading, setLoading] = useState(true);

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
          navigate("/dh-inventory")
        }

        else if (storeduserRole === "CUSTODIAN") {
          navigate("/ctn-home-1")
        }

        else if (storeduserRole === "ADMIN") {
          navigate("/home-1")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  useEffect(() => {
    const usersRole = localStorage.getItem("userRole");
    setUserdRole(usersRole);

    if(usersRole != "ADMIN"){
      const usersDepartment = localStorage.getItem("userDepartment");
      setSelectedOption1(usersDepartment);
    }
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://ppemanagement.andrieinthesun.com/inventory.php");
        setInventoryData(response.data.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    const getDepartmentData = async () => {
      try {
        const response = await axios.get("https://ppemanagement.andrieinthesun.com/getDepartment.php");
        if (usersRole !== "ADMIN" && usersDepartment) {
          departments = departments.filter(
            (dept) => dept.entity_name === usersDepartment
          );
        }
        setDepartmentData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    const getYears = async () => {
      try {
        const response = await axios.get("https://ppemanagement.andrieinthesun.com/getYear.php");
        setYears(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
    getDepartmentData();
    getYears();
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
    setReportMenuOpen((prevOpen) => !prevOpen);
  };

  const handleViewClick = (formIds, descript) => {
    console.log("Clicked form_id:", formIds);
    navigate(`/dh-item-history/${formIds}/${descript}`);

  };
  const currentYear = new Date().getFullYear().toString();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState(currentYear);
 
  const tableRef = useRef();


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (years.length > 0) {
      const currentYear = new Date().getFullYear().toString();
      const found = years.some((dept) => dept.year === currentYear);
      setSelectedOption2(found ? currentYear : "");
    }
  }, [years]);


  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };


  const handleDropdownChange2 = (event) => {
    setSelectedOption2(event.target.value);
  };


  const handlePrint = () => {
    console.log("Printing report...");

    if (filteredInventory.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Data",
        text: "There is no data to print.",
        confirmButtonColor: "#0F1D9F",
      });
      return;
    }

    const content = `
      <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 20px;">
        <div style="text-align: center; font-size: 20px; font-weight: bold;">
          INVENTORY REPORT
        </div>
        <div style="text-align: center; font-size: 11px;">
          ${selectedOption1 ? `${selectedOption1}` : "All Departments"}<br>
        </div>

        <table border="1" cellspacing="0" cellpadding="10" style="width:100%; margin-top: 30px; border-collapse: collapse; font-size: 10px; text-align: center;">
          <thead>
            <tr>
              <th>Description</th>
              <th>From ID</th>
              <th>Date Acquired</th>
              <th>Department</th>
              <th>Original Quantity</th>
              <th>Counted Quantity</th>
              <th>Inspected Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInventory.map(row => `
              <tr>
                <td>${row.description}</td>
                <td>${row.form_id}</td>
                <td>${row.date_acquisition}</td>
                <td>${row.department}</td>
                <td>${row.quantity}</td>
                <td>${row.countedQuantity}</td>
                <td>${row.date}</td>
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
      filename: `${`Inventory_Report ${selectedOption1}`.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }

  const filteredInventory = inventoryData.filter((row) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      row.description?.toLowerCase().includes(term) ||
      row.form_id?.toString().toLowerCase().includes(term) ||
      row.quantity?.toString().toLowerCase().includes(term) ||
      row.department?.toLowerCase().includes(term) ||
      row.date_acquisition?.toLowerCase().includes(term);

    const matchesDepartment =
      !selectedOption1 || row.department === selectedOption1;

    const matchesYear =
      !selectedOption2 || (row.date && row.date.slice(0, 4) === selectedOption2);

    return matchesSearch && matchesDepartment && matchesYear;
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
                      style={{ paddingLeft: 32, color: "#0F1D9F" }}
                      onClick={() => handleListItemClick("/dh-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon style={{ color: "#0F1D9F"}}/>
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

      <div
        style={{
          flexGrow: 1,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div className="header-section-container">
          <div className="header-content">
            <div className="left-column">
              <h1>Inventory Records</h1>
              <p>Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
            </div>
            `<button className="print-button" onClick={handlePrint} style={buttonStyles}>
              <PrintIcon style={{ marginRight: "10px" }} />
              Generate Report
            </button>`
          </div>
        </div>
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
            onChange={handleSearchChange}
            className="search-input"
            style={{maxWidth: "750px" }}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <FormControl
            variant="outlined"
            className="dropdown"
            style={{ maxWidth: "230px"}}
          >
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedOption1}
              onChange={handleDropdownChange1}
              label="Department"
              disabled={userdRole !== "ADMIN"}
            >
              <MenuItem value="">All</MenuItem>
              {departmentData.map((dept) => (
                <MenuItem key={dept.entity_id} value={dept.entity_name}>
                  {dept.entity_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            className="dropdown"
            style={{
              maxWidth: "160px",
            }}
          >
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedOption2}
              onChange={handleDropdownChange2}
              label="Year"
            >
              <MenuItem value="">All</MenuItem>
              {years.map((dept) => (
                <MenuItem key={dept.entity_id} value={dept.year}>
                  {dept.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <StyledTableContainer component={Paper} ref={tableRef} style={{ maxWidth: "1160px" }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <StyledTableDataCell isHeader={true}>Description</StyledTableDataCell>
                <StyledTableDataCell isHeader={true}>Form ID</StyledTableDataCell>
                {/* <StyledTableDataCell isHeader={true}>Unit</StyledTableDataCell> */}
                <StyledTableDataCell isHeader={true}>Quantity</StyledTableDataCell>
                <StyledTableDataCell isHeader={true}>Department</StyledTableDataCell>
                <StyledTableDataCell isHeader={true}>Date Acquired</StyledTableDataCell>
                <StyledTableDataCell isHeader={true}>Action</StyledTableDataCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <StyledTableDataCell colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                    Fetching data...
                  </StyledTableDataCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <StyledTableDataCell colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                    No Inventory Found
                  </StyledTableDataCell>
                </TableRow>
              ) : (
                filteredInventory.map((row, index) => (
                  <TableRow key={index}>
                    <StyledTableDataCell>{row.description}</StyledTableDataCell>
                    <StyledTableDataCell>{row.form_id}</StyledTableDataCell>
                    {/* <StyledTableDataCell>{row.unit}</StyledTableDataCell> */}
                    <StyledTableDataCell>{row.quantity}</StyledTableDataCell>
                    <StyledTableDataCell>{row.department}</StyledTableDataCell>
                    <StyledTableDataCell>{row.date_acquisition}</StyledTableDataCell>
                    <StyledTableDataCell>
                      <button
                        style={{
                          backgroundColor: "#0F1D9F",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                        onClick={() => handleViewClick(row.form_id, row.description)}
                      >
                        View
                      </button>
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
}


export default DH_InventoryReport;