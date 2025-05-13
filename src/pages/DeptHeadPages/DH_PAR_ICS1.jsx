import React, { useState, useEffect } from "react";
import "../PAR_ICS1.css";
import {
  Drawer,
  Collapse,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Swal from "sweetalert2";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

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

function DH_PAR_ICS1() {
  const navigate = useNavigate();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleButtonClick = (id) => {
    navigate("/par-ics2", { state: { itemId: id } });
  };
  
  const handleListItemClick = (path) => {
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
  
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const [selectedOption1, setSelectedOption1] = useState("");
  
  const handleDropdownChange1 = (event) => setSelectedOption1(event.target.value);

  const [selectedOption2, setSelectedOption2] = useState("");
  
  const handleDropdownChange2 = (event) => setSelectedOption2(event.target.value);

  const [calendarVisible, setCalendarVisible] = useState(false);
  
  const toggleCalendar = () => setCalendarVisible((prev) => !prev);
  
  const closeCalendar = () => setCalendarVisible(false);

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
                      style={{ paddingLeft: 32, color: "#0F1D9F" }}
                      onClick={() => handleListItemClick("/dh-parics1")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon style={{ color: "#0F1D9F"}}/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/dh-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon />
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

      {/* Main Content */}
      <div style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "10px"
      }}>
        {/* Header Container */}
        <div className="header-container">
          <h1>PAR and ICS Records</h1>
          <p className="text">Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
        </div>

        {/* Search and Dropdowns */}
        <div className="search-dropdown-container"
             style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px", }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            style={{ maxWidth: "712px", }}
            InputProps={{
              startAdornment: <SearchIcon className="search-icon" />,
            }}
          />
          
          {/* Form Dropdown */}
          <FormControl variant="outlined" className="dropdown" style={{ maxWidth: "160px", }}>
            <InputLabel>Form</InputLabel>
            <Select value={selectedOption1} onChange={handleDropdownChange1} label="Form">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="optionA">Property Acknowledgement Receipt(PAR)</MenuItem>
              <MenuItem value="optionB">Inventory Custodian Slip (ICS)</MenuItem>
            </Select>
          </FormControl>

          {/* Department Dropdown */}
          <FormControl variant="outlined" className="dropdown" style={{ maxWidth: "160px", }}>
            <InputLabel>Department</InputLabel>
            <Select value={selectedOption2} onChange={handleDropdownChange2} label="Department">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="optionC">General Service Office (GSO)</MenuItem>
              <MenuItem value="optionD">MPDO</MenuItem>
              <MenuItem value="optionE">MAYOR'S OFFICE</MenuItem>
              <MenuItem value="optionF">ENGINEERING</MenuItem>
              <MenuItem value="optionG">ACCOUNTING</MenuItem>
            </Select>
          </FormControl>

          {/* Calendar Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={toggleCalendar}
            style={{ height: "56px", backgroundColor: "#0F1D9F", color:"white"}}
          >
            <CalendarTodayIcon />
          </Button>
        </div>

        {/* Calendar Dialog */}
        <Dialog open={calendarVisible} onClose={closeCalendar} fullWidth maxWidth="sm">
          <DialogTitle>Calendar</DialogTitle>
          <DialogContent>
            <p>Date Range Picker</p>
            {/* Start Date Field */}
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: "10px" }}
            />
            
            {/* End Date Field */}
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: "10px" }}
            />
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions>
            <Button onClick={closeCalendar} color="secondary">Cancel</Button>
            {/* Apply Button could have logic here to filter based on selected dates */}
            <Button onClick={() => { closeCalendar(); }} color="primary">Apply</Button>
          </DialogActions>
        </Dialog>

        {/* Data Table */}
        <StyledTableContainer component={Paper}>
          <Table size="medium">
            {/* Table Head */}
            <TableHead>
              <TableRow>
                {["Type", "Form ID", "Entity Name", "Fund Cluster", "Date", "Action"].map((header) =>
                  (<StyledTableDataCell key={header} isHeader>{header}</StyledTableDataCell>)
                )}
              </TableRow>
            </TableHead>

            {/* Table Body with Sample Data */}
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.item_id}>
                <StyledTableDataCell>{(row.form_id[0]) === 'i' ? 'ICS' : 'PAR'}</StyledTableDataCell>
                <StyledTableDataCell>{row.form_id}</StyledTableDataCell>
                <StyledTableDataCell>{row.entityName}</StyledTableDataCell>
                <StyledTableDataCell>{row.fundCluster}</StyledTableDataCell>
                <StyledTableDataCell>{row.date}</StyledTableDataCell>

                  <StyledTableDataCell>
                    <button
                      style={{
                        backgroundColor:"#0F1D9F", 
                        color:"white", 
                        border:"none", 
                        padding:"8px 16px", 
                        borderRadius:"4px", 
                        cursor:"pointer", 
                        fontSize:"14px"
                      }}
                      onClick={() => handleButtonClick(row.form_id)}
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

export default DH_PAR_ICS1;
