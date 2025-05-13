import React, { useState, useRef, useEffect} from "react";
import "./PAR_ICS2.css";
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Collapse,
} from "@mui/material";
import Header from "../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import PrintIcon from "@mui/icons-material/Print";
import { styled } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Swal from "sweetalert2";



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
    {/* First Input */}
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
    {/* Second Input */}
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
 
const StyledTableCell = styled(TableCell)(({ isHeader }) => ({
  fontWeight: isHeader ? "bold" : "normal",
  fontSize: isHeader ? "16px" : "14px",
  color: isHeader ? "#0f1d9f" : "#333333",
  textAlign: "center",
  borderBottom: "2px solid #979797",
  padding: "10px 16px",
}));


const StyledTableContainer = styled(TableContainer)({
  marginTop: "10px",
  marginLeft: "0px",
  marginRight: "20px",
  width: "100%",
  maxWidth: "1490px",
  borderRadius: "10px",
  border: "1px solid #979797",
  overflowY: "auto",
});




function PAR_ICS2() {
  const location = useLocation();
  const { itemId } = location.state || {};

  const navigate = useNavigate();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(true);
  
  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getItemID();
  }, [])

  const getItemID = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getItem/${itemId}`);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const tableRef = useRef();


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };


  const handlePrint = () => {
    const content = tableRef.current.innerHTML;  
    const reportType = selectedOption1 === "optionA" ? "Property Acknowledgement Receipt" : "Inventory Custodian Slip";
   
    const printContent = `
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 10px; /* Set default font size to 10px */
            }
 
            .report-title {
              text-align: center;
              font-size: 18px; /* Keep font size of 18px for report title */
              font-weight: bold; /* Make report title bold */
            }
 
            .header {
              margin-top: 20px;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
 
            .header-item {
              display: flex;
              align-items: center;
              font-size: 10px; /* Apply 10px font size to header-item text */
              font-weight: bold; /* Make header-item text bold */
            }
 
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
 
            .table, .table th, .table td {
              border: 1px solid black;
            }
 
            .table th, .table td {
              padding: 10px;
              text-align: center;
              font-size: 10px;
              /* No bold for table content */
            }
 
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
 
            .footer div {
              text-align: center;
              font-size: 10px; /* Set footer text size to 10px */
              font-weight: bold; /* Make footer text bold */
            }
 
            .signature {
              margin-top: 20px;
              border-top: 1px solid black;
              width: 100%;
              font-weight: bold; /* Set font weight to bold */
            }
          </style>
        </head>
        <body>
          <div class="report-title">${reportType}</div>
 
          <div class="header">
            <div class="header-item"><strong>Entity Name:</strong> ____________________________</div>
            <div class="header-item"><strong>Fund Cluster:</strong> ____________________________</div>
            <div class="header-item"><strong>Date:</strong> ____________________________</div>
            <div class="header-item"><strong>PAR No.:</strong> ____________________________</div>
          </div>
 
          <table class="table">
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Description</th>
                <th>Property No.</th>
                <th>Date Acquired</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tableData
                .map(
                  (row) => `
                    <tr>
                      <td>${row.quantity}</td>
                      <td>${row.unit}</td>
                      <td>${row.description}</td>
                      <td>${row.procsid}</td>
                      <td>${row.dateAcquired}</td>
                      <td>${row.unitCost}</td>
                      <td>${row.totalCost}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
 
          <div class="footer">
            <div>
              <div>Issued by:</div>
              <div class="signature"></div>
              <div>Signature over Printed Name of FAD Authorized Representative</div>
            </div>
            <div>
              <div>Received by:</div>
              <div class="signature"></div>
              <div>Signature over Printed Name of End User</div>
              <div class="signature"></div>
              <div>Position/Office</div>
              <div class="signature"></div>
              <div>Date</div>
            </div>
          </div>
        </body>
      </html>
    `;
 
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
      printWindow.onafterprint = () => {
      printWindow.close();
    };
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
          <ListItem button onClick={() => handleListItemClick(0, "/home-1")}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(1, "/purchase-request")}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(2, "/inspection")}>
            <ListItemIcon><ReportIcon /></ListItemIcon>
            <ListItemText primary="Inspection" />
          </ListItem>
          {/* Main Report Button */}
          <ListItem button onClick={toggleReportMenu}>
            <ListItemIcon><ReportIcon /></ListItemIcon>
            <ListItemText primary="Records" />
            {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {/* Sub-Buttons (collapsible) */}
          <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                style={{ paddingLeft: 32, color: "#0F1D9F"}}
                onClick={() => handleListItemClick(5, "/par-ics")}
              >
                <ListItemIcon style={{ color:"#0F1D9F"}} >
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(4, "/inventory")}
              >
              <ListItemIcon >
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Collapse>
          {/* Additional List Items */}
          {/* Example for Account Management */}
          <ListItem button onClick={() => handleListItemClick(4, "/account-management")} style={{ color: selectedIndex === 4 ? "#0F1D9F" : "inherit" }}>
            <ListItemIcon><PeopleIcon/></ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          {/* Manage Tables and Profile */}
          <ListItem button onClick={() => handleListItemClick(6, "/profile")}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          {/* Logout Button */}
          <ListItem button onClick={() => handleLogout(7, "/")}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
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
        {/* Header and Buttons */}
        <div className="header-section-container">
          <div className="header-content">
            <div className="left-column">
              <h1>PAR and ICS Records</h1>
              <p>Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
            </div>


            <button className="print-button" onClick={handlePrint} style={buttonStyles}>
              <PrintIcon style={{ marginRight: "10px" }} />
              Print Report
            </button>
          </div>
        </div>


        {/* Search and Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ flex: 1 }}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />


          {/* Dropdown Selection */}
          <FormControl style={{ minWidth: "150px" }}>
            <InputLabel>Report Type</InputLabel>
            <Select value={selectedOption1} onChange={handleDropdownChange1} label="Report Type">
              <MenuItem value="optionA">Property Acknowledgement Receipt(PAR)</MenuItem>
              <MenuItem value="optionB">Inventory Custodian Slip (ICS)</MenuItem>
            </Select>
          </FormControl>
        </div>


        {/* Table Data */}
        <StyledTableContainer ref={tableRef} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell isHeader={true}>Quantity</StyledTableCell>
                <StyledTableCell isHeader={true}>Unit</StyledTableCell>
                <StyledTableCell isHeader={true}>Description</StyledTableCell>
                <StyledTableCell isHeader={true}>Property No.</StyledTableCell>
                <StyledTableCell isHeader={true}>Date Acquired</StyledTableCell>
                <StyledTableCell isHeader={true}>Unit Cost</StyledTableCell>
                <StyledTableCell isHeader={true}>Total Cost</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{row.quantity}</StyledTableCell>
                  <StyledTableCell>{row.unit}</StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{row.procsid}</StyledTableCell> {/* Assuming you want to show 'procsid_range' */}
                  <StyledTableCell>{row.dateAcquired}</StyledTableCell> {/* Assuming you have a dateAcquired column */}
                  <StyledTableCell>{row.unitCost}</StyledTableCell>
                  <StyledTableCell>{row.totalCost}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>


      </div>
    </div>
  );
}


export default PAR_ICS2;