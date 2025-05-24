import React, { useState, useRef, useEffect} from "react";
import "./Inventory_report.css";
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
import Header from "../components/Header/Header.jsx";
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


function InventoryReport() {
    const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected menu item
  const [isReportMenuOpen, setReportMenuOpen] = useState(true); // Track sub-menu visibility

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
          navigate("/inventory")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  const handleListItemClick = (path) => {
    navigate(path); // Navigate to the selected route
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
    setReportMenuOpen((prevOpen) => !prevOpen); // Toggle sub-menu visibility
  };

  const handleViewClick = () =>{
    navigate("/item-history")
  }


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");


  const tableData = [
    {
      description: "Laptop",
      propertyNo: "ABC123",
      unit: "Piece",
      quantity: 10,
      department: "MPDO",
      dateAcquired: "2022-01-01",
      unitCost: 50000,
      totalCost: 500000,
    },
    {
      description: "Desktop Computer",
      propertyNo: "XYZ456",
      unit: "Piece",
      quantity: 5,
      department: "GSO",
      dateAcquired: "2021-06-15",
      unitCost: 30000,
      totalCost: 150000,
    },
    {
      description: "Projector",
      propertyNo: "LMN789",
      unit: "Piece",
      quantity: 3,
      department: "MAYOR'S OFFICE",
      dateAcquired: "2023-03-10",
      unitCost: 15000,
      totalCost: 45000,
    },
    {
      description: "Air Conditioner",
      propertyNo: "DEF123",
      unit: "Unit",
      quantity: 2,
      department: "ACCOUNTING",
      dateAcquired: "2020-12-05",
      unitCost: 25000,
      totalCost: 50000,
    },
  ];
 
  const tableRef = useRef();


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };


  const handleDropdownChange2 = (event) => {
    setSelectedOption2(event.target.value);
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
              font-size: 10px;
            }
           
            .report-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
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
              font-size: 10px;
              font-weight: bold;
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
            }
           
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
           
            .footer div {
              text-align: center;
              font-size: 10px;
              font-weight: bold;
            }
           
            .signature {
              margin-top: 20px;
              border-top: 1px solid black;
              width: 100%;
              font-weight: bold;
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
                <th>Description</th>
                <th>Property No.</th>
                <th>Unit Cost</th>
                <th>Quantity</th>
                <th>Date Acquired</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tableData
                .map(
                  (row) => `
                    <tr>
                      <td>${row.description}</td>
                      <td>${row.propertyNo}</td>+
                      <td>${row.unitCost}</td>
                      <td>${row.quantity}</td>
                      <td>${row.dateAcquired}</td>
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
                      <ListItem button onClick={() => handleListItemClick("/inspection")} >
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
                            style={{ paddingLeft: 32, color: "#0F1D9F" }}
                            onClick={() => handleListItemClick("/inventory")}
                          >
                            <ListItemIcon>
                                            <AssignmentIcon style={{ color: "#0F1D9F"}}/>
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
            <button className="print-button" onClick={handlePrint} style={buttonStyles}>
              <PrintIcon style={{ marginRight: "10px" }} />
              Generate Report
            </button>
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
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="optionA">General Sevices Office</MenuItem>
              <MenuItem value="optionB">MDRRMO</MenuItem>
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
              <MenuItem value="optionC">2023</MenuItem>
              <MenuItem value="optionD">2024</MenuItem>
            </Select>
          </FormControl>
        </div>
        <StyledTableContainer component={Paper} ref={tableRef} style={{ maxWidth: "1160px" }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <StyledTableDataCell isHeader={true}>Description</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Property/Inventory No.</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Unit</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Quantity</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Department</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Date Acquired</StyledTableDataCell>
            <StyledTableDataCell isHeader={true}>Action</StyledTableDataCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <StyledTableDataCell>{row.description}</StyledTableDataCell>
              <StyledTableDataCell>{row.propertyNo}</StyledTableDataCell>
              <StyledTableDataCell>{row.unit}</StyledTableDataCell>
              <StyledTableDataCell>{row.quantity}</StyledTableDataCell>
              <StyledTableDataCell>{row.department}</StyledTableDataCell>
              <StyledTableDataCell>{row.dateAcquired}</StyledTableDataCell>
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
                  onClick={handleViewClick}
                >
                  View
                </button>
              </StyledTableDataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
      </div>
    </div>
  );
}


export default InventoryReport;