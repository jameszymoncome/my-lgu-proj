import React, { useState, useEffect } from "react"; // Import useState and useEffect
import "../Item_history.css";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Typography } from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate, useParams } from "react-router-dom";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import axios from "axios";
import PrintIcon from "@mui/icons-material/Print";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
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

  const TextInput = ({ descript, propertyNo, dateAcquired, origQuantity }) => {
  
    return (
      <div className="input-container">
        {/* First Input */}
        <div className="input-group">
          <label htmlFor="description" className="label">
            Description:
          </label>
          <input
            type="text"
            id="description"
            className="text-input"
            placeholder="Enter description "
            style={{ width: "53%" }}
            value={descript || ""}
            readOnly
          />
        </div>
 
        {/* Second Input */}
        <div className="input-group">
          <label htmlFor="par/ics no." className="label">
            PAR/ICS No.:
          </label>
          <input
            type="text"
            id="par/ics no."
            className="text-input"
            placeholder="Enter PAR/ICS no."
            style={{ width: "63%" }}
            value={propertyNo || ""}
            readOnly
          />
        </div>
 
        {/* Third Input */}
        <div className="input-group">
          <label htmlFor="date acquired" className="label">
            Date Acquired:
          </label>
          <input
            type="text"
            id="date acquired"
            className="text-input"
            placeholder="Enter date acquired"
            style={{ width: "50%" }}
            value={dateAcquired || ""}
            readOnly
          />
        </div>
 
        {/* Fourth Input */}
        <div className="input-group">
          <label htmlFor="property/inventory no." className="label">
            Original Quantity.:
          </label>
          <input
            type="text"
            id="property/inventory no."
            className="text-input"
            placeholder="Enter property/inventory no."
            style={{ width: "50%" }}
            value={origQuantity || ""}
            readOnly
          />
        </div>
      </div>
    );
  };

  const StyledTableCell = styled(TableCell)(({ isHeader }) => ({
    fontWeight: isHeader ? "bold" : "normal",
    fontSize: isHeader ? "16px" : "14px",
    color: isHeader ? "#0f1d9f" : "#333333",
    textAlign: "center",
    padding: "10px 16px",
    borderBottom: isHeader ? "2px solid #979797" : "none",
    borderLeft: "none",
    borderRight: "none",
  }));
 
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
 
function CTN_Item_history() {
  const { formIds, descript } = useParams();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(true);
  const [propertyNo, setPropertyNo] = useState("");
  const [dateAcquired, setDateAcquired] = useState("");
  const [icsParNO, setIcsParNo] = useState("");
  const [inventoryGetData, setInventoryGetData] = useState([]);
  const [origQuantity, setOrigQuantity] = useState("");
  const [countedQuantity, setCountedQuantity] = useState(0);

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
          }
  
          else if (storeduserRole === "ADMIN") {
            navigate("/home-1")
          }
  
          else {
            navigate("/")
          }
    }, [navigate]);

  useEffect(() => {
    const getDataStatus = async () => {
      try {
        const response = await axios.post("https://ppemanagement.andrieinthesun.com/getDataStat.php", {
          formIds: formIds,
          descript: descript
        });
        setInventoryGetData(response.data.data);
        console.log(response.data.data[0]);
        setPropertyNo(response.data.data[0].form_id);
        setDateAcquired(response.data.data[0].date_acquisition);
        setIcsParNo(response.data.data[0].entity_id);
        setOrigQuantity(response.data.data[0].originalQuantity);
        setCountedQuantity(response.data.data.length); // Set the counted quantity based on the length of the data array
        console.log("Fetched data:", response.data.data[0].countedQuantity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getDataStatus();
  }, [formIds, descript]);

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

  const handlePrint = () => {
    console.log("Printing report...");

    const content = `
      <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 20px;">
        <div style="text-align: center; font-size: 11px;">
          INVENTORY REPORT
        </div>

        <div style="margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div>
            <strong>Description:</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${descript}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
          <div>
            <strong>PAR/ICS No.</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${propertyNo}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
          <div>
            <strong>Date Acquired:</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${dateAcquired}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
          <div>
            <strong>Original Quantity:</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${origQuantity}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
        </div>

        <table border="1" cellspacing="0" cellpadding="10" style="width:100%; margin-top: 30px; border-collapse: collapse; font-size: 10px; text-align: center;">
          <thead>
            <tr>
              <th>Property/Inventory No.</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${inventoryGetData.map(row => `
              <tr>
                <td>${row.form_id}</td>
                <td>${row.dates}</td>
                <td>${row.status}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <div style="margin-top: 90px;">
          <div style="margin-top: 90px; text-align: left; font-size: 10px; font-weight: bold;">
            Counted Quantity: <span>${countedQuantity}</span>
          </div>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = content;

    html2pdf().set({
      margin: 0.5,
      filename: `${'Report'.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }
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
                      <ListItem button onClick={() => handleListItemClick("/ctn-purchase-list")} >
                        <ListItemIcon>
                          <AssignmentIcon />
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
                            style={{ paddingLeft: 32, color: "#0F1D9F" }}
                            onClick={() => handleListItemClick("/ctn-inventory")}
                          >
                            <ListItemIcon>
                                            <AssignmentIcon style={{ color: "#0F1D9F"}}/>
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
        <div className="header-container">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>Item History</h1>
            <p className="text">
              Generate and View Inventory, Issuance, Inspections, and Status
              Reports
            </p>
          </div>
          <button className="print-button"  onClick={handlePrint} style={buttonStyles}>
            <PrintIcon style={{ marginRight: "10px" }} />
            Generate Report
          </button>
        </div>
        <TextInput descript={descript} propertyNo={propertyNo} dateAcquired={dateAcquired} origQuantity={origQuantity} />


        <StyledTableContainer component={Paper}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <StyledTableCell isHeader={true}>Property/Inventory No.</StyledTableCell>
            <StyledTableCell isHeader={true}>Date</StyledTableCell>
            <StyledTableCell isHeader={true}>Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryGetData.map((row, index) => (
            <TableRow key={index}>
              <StyledTableCell style={{ width: "33%" }}>{row.entity_id}</StyledTableCell>
              <StyledTableCell style={{ width: "33%" }}>{row.dates}</StyledTableCell>
              {/* <StyledTableDataCell>{row.unit}</StyledTableDataCell> */}
              <StyledTableCell style={{ width: "33%" }}>{row.status}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
    <div style={{ marginTop: "13px", marginLeft: "30px", color: "#0F1D9F", fontWeight: "bold" }}>
      Counted Quantity: {inventoryGetData.length}
    </div>
      </div>
    </div>
  );
}


export default CTN_Item_history;