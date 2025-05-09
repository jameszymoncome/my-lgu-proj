import React, { useEffect, useState } from "react";
import Scans from '../assets/images/scans.png';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Collapse } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Inspection_Scanner.css";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
  } from "@mui/material";
import Header from "../components/Header/Header.jsx";
import { red } from "@mui/material/colors";
import axios from "axios";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import { use } from "react";

const drawerWidth = 240;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: "10px",
  width: "100%",
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

const Inspection_Scanner = () => {
  const [proInvenID, setproInvenID] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const options = ['Broken', 'Irreparable', 'Good'];
  const  [scanResult, setScanResult] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);
  const [itemDescription, setItemDescription] = useState('');
  const [formId, setFormId] = useState('');
  const [itemGet, setItemGet] = useState([]);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isGetItems, setGetItems] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // State to track the selected row
  const [isContinue, setIsConinue] = useState(false); // State to track loading status

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/item-check`);

      if (response.data.success) {
        Swal.fire({
          title: "Backup Confirmation",
          text: "Do you want to continue with the backup data?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Continue",
          cancelButtonText: "No, Cancel",
          confirmButtonColor: "#0F1D9F",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user confirms, store the data in itemGet
            setItemGet((prevItems) => [...prevItems, ...response.data.data]);
            console.log("Fetched data stored in itemGet:", response.data.data);
          } else {
            console.log("User canceled the backup.");
          }
        });

        // setItemGet((prevItems) => [...prevItems, ...response.data.data]);
        // return console.log("Fetched data:", response.data.data);


      } else {
        
      }
    } catch (error) {
      console.error("Error fetching scanned details:", error);
    }
  }

  const startScanner = () => {
    console.log("Scanner started"); // Log when the scanner starts
    const readerElement = document.getElementById("reader");
    const imgElement = document.getElementById("scanImage");
  
    imgElement.style.display = "none"; // Hide the image
    readerElement.style.display = "block"; // Show the scanner
  
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 150, // Width of the scanning box
        height: 150, // Height of the scanning box
      },
      fps: 5, // Frames per second
    });
  
    scanner.render(
      async (result) => {
        setScanResult(result); // Update the scan result
        scanner.clear(); // Stop the scanner after a successful scan
        readerElement.style.display = "none"; // Hide the scanner
        imgElement.style.display = "block"; // Show the image again

        await scannedDetial(result); // Call the scannedDetial function to fetch data
      },
      (error) => {
        console.warn(error); // Log errors for debugging
      }
    );
    setQrScanned(true);
  };

  const scannedDetial = async (id, stattts) => {
    try {
      const response = await axios.get(`http://localhost:5000/item-scanned/${id}`);
      if (response.data && response.data.data) {
        setFormId(response.data.data.form_id || "");
        setItemDescription(response.data.data.description || "");

        setItemGet((prevItems) => {
          // Check if the item already exists in the array
          const isDuplicate = prevItems.some((item) => item.itemIds === response.data.data.itemIds);
        
          if (!isDuplicate) {
            // If not a duplicate, add the new item
            // console.log("New item added:", response.data.data);
            return [...prevItems, { ...response.data.data, status: stattts }];
          } else {
            // console.log("Duplicate item detected:", response.data.data);
            return prevItems.map((item) =>
              item.itemIds === response.data.data.itemIds
                ? { ...item, status: stattts }
                : item
            );
          }
        });
        savetoBackup(response.data.data.itemIds, stattts);

      } else {
        console.error("Invalid response format:", response.data);
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching scanned details:", error);
      alert("Failed to fetch scanned details. Please try again.");
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
  
    // Get the date in YYYY-MM-DD format
    const date = now.toISOString().split("T")[0];
  
    // Get the time in HH:MM:SS format
    const time = now.toTimeString().split(" ")[0];
  
    return { date, time };
  };
  
  const savetoBackup = async (ids, staat) => {

    const { date, time } = getCurrentDateTime();
    try {
      const response = await axios.get(`http://localhost:5000/ppe-entries-backup/${ids}/${date}/${time}/${staat}`);
      if(response.data.success) {
        console.log("Data saved to backup successfully:", response.data.data);
      }
      else {  
        console.error("Failed to save data to backup:", response.data.message);
        alert("Failed to save data to backup. Please try again.");
      }
    } catch (error) {
      console.error("Error saving to backup:", error);
      alert("Failed to save to backup. Please try again.");
    }
    console.log("Saving to backup.", date, time);
  }

  const data = [
    { Description: "MAYOR'S OFFICE", PropertyInventory: "2024-12-01", PARICS: "Completed", ExItem: "2", ItemSca: "2", ItemRem: "2", stats: "Good" },
    { Description: "ACCOUNTING", PropertyInventory: "2024-12-02", PARICS: "In Progress", ExItem: "2", ItemSca: "2", ItemRem: "2", stats: "Good" },
    { Description: "MPDO", PropertyInventory: "2024-12-03", PARICS: "Completed", ExItem: "2", ItemSca: "2", ItemRem: "2", stats: "Good" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected menu item
    const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility

  const navigate = useNavigate();

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
    setReportMenuOpen((prev) => !prev);
  };

  const handleChange = (event) => {
    setproInvenID(event.target.value);
  }

  const selStats = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = async (statts) => {
    if (!proInvenID) {
      alert("Please enter a Property/Inventory ID.");
      return;
    }
    scannedDetial(proInvenID, statts);
    // setItemDescription("");
    // setproInvenID("");
    // setFormId("");

  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };

  const handleView = (row) => {
    const matchingItems = itemGet.filter(
      (item) =>
        item.description === row.description &&
        item.form_id === row.form_id &&
        item.quantity === row.quantity
    );
    setGetItems(matchingItems);
    setOverlayVisible(true);
  };

  const handleEdit = (row) => {
    setScanResult(row.itemIds);
    setItemDescription(row.description);
    setFormId(row.form_id);
    setActiveButton(row.status);
    closeOverlay();
    setproInvenID(row.itemIds);
  }

  const groupedItems = itemGet.reduce((acc, item) => {
    const key = `${item.description}-${item.form_id}-${item.quantity}`; // Create a unique key
    if (!acc[key]) {
      acc[key] = { ...item, count: 1 }; // Initialize with count 1
    } else {
      acc[key].count += 1; // Increment count for duplicates
    }
    return acc;
  }, {});

  const handleDelete = (item) => {
    setGetItems((prevItems) => {
      const updatedItems = prevItems.filter((i) => i.itemIds !== item.itemIds);
  
      const remainingItems = updatedItems.filter(
        (i) =>
          i.description === item.description &&
          i.form_id === item.form_id &&
          i.quantity === item.quantity
      );
  
      if (remainingItems.length === 0) {
        setItemGet((prevItemGet) =>
          prevItemGet.filter(
            (i) =>
              i.description !== item.description ||
              i.form_id !== item.form_id ||
              i.quantity !== item.quantity
          )
        );

        closeOverlay();
      }
  
      console.log("Updated isGetItems:", updatedItems); // Debugging
      return updatedItems;
    });
  };

  const groupedArray = Object.values(groupedItems);


  return (
    <div style={{ display: "flex" }}>
        <Header />
        {isOverlayVisible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1300, // Ensure it appears above the drawer
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h2 style={{ color: "#0F1D9F" }}>Form ID</h2>
              <div style={{ textAlign: "left", marginTop: "10px" }}>
                <p><strong>Description:</strong></p>
                {isGetItems.map((item, index) => (
                  <p>{item.description || "N/A"}</p>
                ))}
              </div>
              <div style={{ marginTop: "20px", width: "100%", marginBottom: "100px"}}>
                <StyledTableContainer component={Paper}>
                  <Table size="medium">
                    <TableRow>
                      {["Property/Inventory Number", "Status", "Action"].map((header) =>
                        (<StyledTableDataCell key={header} isHeader>{header}</StyledTableDataCell>)
                      )}
                    </TableRow>
                    <TableBody>
                    {isGetItems.map((item, index) => (
                      <TableRow key={index}>
                        <StyledTableDataCell>{item.itemIds}</StyledTableDataCell>
                        <StyledTableDataCell>{item.status}</StyledTableDataCell>
                        <StyledTableDataCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(item)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableDataCell>
                        
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              </div>

              <button
                onClick={closeOverlay}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#0F1D9F",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {}

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
          <ListItem
            button
            onClick={() => handleListItemClick(0, "/home")}
          >
            <ListItemIcon>
              <HomeIcon  />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/purchase-request")}
          >
            <ListItemIcon>
              <AssignmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleListItemClick(1, "/inven-inspect")}
            style={{color: "#0F1D9F"}}
          >
            <ListItemIcon>
              <ReportIcon style={{ color: "#0F1D9F" }} />
            </ListItemIcon>
            <ListItemText primary="Inspection" />
          </ListItem>
          <ListItem button onClick={toggleReportMenu}>
            <ListItemIcon>
              <ReportIcon/>
            </ListItemIcon>
            <ListItemText primary="Records" />
            {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(5, "/par-ics")}
              >
                <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32}}
                onClick={() => handleListItemClick(4, "/inventory")}
              >
              <ListItemIcon>
                <AssignmentIcon/>
              </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            style={{ color: selectedIndex === 7 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleListItemClick(7, "/account-management")}
          >
            <ListItemIcon>
              <PeopleIcon style={{ color: selectedIndex === 7 ? "#0F1D9F" : "inherit" }} />
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem
            button
            style={{ color: selectedIndex === 5 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleListItemClick(5, "/manage-tables")}
          >
            <ListItemIcon>
              <TableChartIcon style={{ color: selectedIndex === 5 ? "#0F1D9F" : "inherit" }} />
            </ListItemIcon>
            <ListItemText primary="Manage Tables" />
          </ListItem>
          <ListItem
            button
            style={{ color: selectedIndex === 6 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleListItemClick(6, "/ppe-entry")}
          >
            <ListItemIcon>
              <AccountCircleIcon style={{ color: selectedIndex === 6 ? "#0F1D9F" : "inherit" }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            button
            style={{ color: selectedIndex === 8 ? "#0F1D9F" : "inherit" }}
            onClick={() => handleLogout(8, "/")}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

        <div style={{flexGrow: 1, padding: "80px 40px"}}>
            <header>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                  <h1 style={{color: "#0F1D9F"}}>Inventory Inspection</h1>
                  {/* <img src={Scans} alt="Asset Icon"/> */}
                  <button
                    onClick={() => startScanner()}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      id="scanImage"
                      src={Scans}
                      alt="Asset Icon"
                      style={{ width: "150px", height: "150px" }}
                    />
                  </button>
                  <div id="reader" style={{ display: "none", width: "300px", height: "300px" }}></div>
                </div>
                <div style={{marginTop: 50}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <h4 style={{color: "#0F1D9F"}}>Description:</h4>
                    <h4 style={{color: "#000"}}> {itemDescription} </h4>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <h4 style={{color: "#0F1D9F", margin: 0}}>Property/Inventory Number</h4>
                    <input
                      disabled= {qrScanned} // Disable input if QR code is scanned
                      type="text"
                      value={scanResult} //proInvenID
                      onChange={handleChange}
                      placeholder=""
                      style={{
                        border: "2px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "18px",
                        paddingLeft: 5
                      }}
                    />
                  </div>

                  <div style={{display: 'flex', gap: "10px"}}>
                    <h4 style={{color: "#0F1D9F"}}>PAR/ICS No.</h4>
                    <h4 style={{color: "#000"}}> {formId} </h4>
                  </div>
                  
                  <div style={{display: "flex", gap: "10px", marginBottom: "10px"}}>
                    <h4 style={{color: "#0F1D9F", margin: 0 }}>Status:</h4>
                  </div>
                  <div style={{display: 'flex', gap: "10px"}}>
                    <button 
                      style={{backgroundColor: 'white',
                      color: 'black',
                      border: "2px solid #0F1D9F",
                      borderWidth: "2px",
                      borderRadius: "10px"
                      }}>
                      Cancel
                    </button>
                    <button 
                      style={{backgroundColor: activeButton === "Serviceable" ? "#0F1D9F" : "white",
                        color: activeButton === "Serviceable" ? "white" : 'black',
                        border: "2px solid #0F1D9F",
                        borderWidth: "2px",
                        borderRadius: "10px"
                      }}
                      onClick={() => {
                        handleConfirm("Serviceable");
                        setActiveButton("Serviceable"); // Set the state to true when this button is clicked
                      }}>
                      Servicesable
                    </button>
                    <button 
                      style={{backgroundColor: activeButton === "UnServiceable" ? "#0F1D9F" : "white",
                      color: activeButton === "UnServiceable" ? "white" : 'black',
                      border: "2px solid #0F1D9F",
                      borderWidth: "2px",
                      borderRadius: "10px"
                      }}
                      onClick={() => {
                        handleConfirm("UnServiceable");
                        setActiveButton("UnServiceable"); // Set the state to true when this button is clicked
                        }}
                      >
                      Unservicesable
                    </button>
                  </div>
                    
                </div>
              </div>
            </header>

            <div style={{ marginTop: "40px", width: "100%", marginBottom: "100px"}}>
              <StyledTableContainer component={Paper}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      {["Description", "Property/Inventory Number", "PAR/ICS No.", "Expected Count", "Item Scanned", "Items Remaining", "Status", "Action"].map((header) =>
                        (<StyledTableDataCell key={header} isHeader>{header}</StyledTableDataCell>)
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {groupedArray.map((row, index) => (
                      <TableRow
                        key={index}
                        onClick={() => setSelectedRow(index)} // Set the selected row index on click
                        style={{
                          backgroundColor: selectedRow === index ? "#e0f7fa" : "white", // Highlight selected row
                          cursor: "pointer", // Add pointer cursor for better UX
                        }}
                      >
                        <StyledTableDataCell>{row.description}</StyledTableDataCell>
                        <StyledTableDataCell>{row.itemIds}</StyledTableDataCell>
                        <StyledTableDataCell>{row.form_id}</StyledTableDataCell>
                        <StyledTableDataCell>{row.quantity}</StyledTableDataCell>
                        <StyledTableDataCell>{row.count}</StyledTableDataCell>
                        <StyledTableDataCell>{row.quantity - row. count}</StyledTableDataCell>
                        <StyledTableDataCell>{row.quantity - row. count === 0 ? "Complete" : "Incomplete"}</StyledTableDataCell>
                        <StyledTableDataCell>
                          {/* View Button */}
                          <IconButton
                            color="primary"
                            onClick={() => handleView(row)}
                          >
                            <ViewIcon />
                          </IconButton>
                          {/* Delete Button */}
                        </StyledTableDataCell>
      
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </div>

            <div style={{display: 'flex', justifyContent: 'end', gap: "10px"}}>
              <button 
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: "2px solid #0F1D9F",
                  borderWidth: "2px",
                  borderRadius: "10px"
                }}>
                Cancel
              </button>
              <button
                style={{
                  borderRadius: "10px"
                }}
                onClick={() => savetoBackup()}
                >
                Save
              </button>
            </div>
        </div>

    </div>
  )
}

export default Inspection_Scanner;