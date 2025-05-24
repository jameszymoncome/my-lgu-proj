import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { FaEye } from 'react-icons/fa';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Collapse, TextField, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import './inspection.css';
import '../index.css';
import Header from "../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;

const Inspection = () => {
    const navigate = useNavigate();
    
    const videoRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track selected menu item
    const [isReportMenuOpen, setReportMenuOpen] = useState(false); // Track sub-menu visibility
    const [qrData, setQrData] = useState('No QR code scanned');
    const [openOverlay, setOpenOverlay] = useState(false);
    const [checkOverlay, setCheckOverlay] = useState(false);
    const [newCheck, setNewCheck] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState('');
    const [itemGet, setItemGet] = useState([]);
    const [itemInfo, setItemInfo] = useState({
        description: "",
        parIcsNo: "",
        departmentCustodian: "",
        conditionStatus: ""
    });
    const [newCondition, setNewCondition] = useState('');

    const updateCondition = (condition) => {
        setNewCondition(condition);
        // If you want to also update the itemInfo.conditionStatus itself:
        setItemInfo(prev => ({
            ...prev,
            conditionStatus: condition
        }));
    
        // Optional: Here you can also send an API request to update in the database
    };

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
          navigate("/inspection")
        }

        else {
          navigate("/")
        }
  }, [navigate]);


    useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stream;

    const startScanner = async () => {
        try {
            const videoElement = videoRef.current;
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

            videoElement.srcObject = stream;

            codeReader.decodeFromVideoDevice(null, videoElement, async (result, error) => {
                if (result) {
                    const qrText = result.getText();
                    setQrData(qrText); // optional display

                    // Update inputValue and call checkItemInfo
                    setInputValue(qrText);
                    await checkItemInfo(qrText);
                }

                if (error) {
                    console.warn('QR Code Scanner Error:', error.message);
                }
            });
        } catch (error) {
            console.error('Error accessing the camera:', error);
            setQrData('Error accessing the camera. Please check permissions.');
        }
    };

    startScanner();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };
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

    const handleViewRecord = () => {
        navigate("/inspec-scanner")
    }

    const checkItemInfo = async (valueFromScan) => {
        console.log(valueFromScan);

        if(valueFromScan === ''){
            alert('Enter id');
            return;
        }
        try {
            const response = await axios.post("http://ppemanagement.andrieinthesun.com/scanItem.php", {
                valueFromScan: valueFromScan,
            });
    
            if (response.data.success) {
                setItemGet(response.data.data[0]);
                if(response.data.message == 'First'){
                    console.log(response.data.message);
                    setNewCheck(false);
                }
                else{
                    console.log(response.data.message);
                    setNewCheck(true);
                }
                setOpenOverlay(true);
            } else {
                setMessages(response.data.message);
                setCheckOverlay(true);
            }
        } catch (error) {
            console.error("Error submitting for approval:", error);
            alert("Failed to submit for approval.");
        } finally {
            setInputValue('');
        }
    }

    const updateScanItem = async(id, stat) => {
        console.log(id, stat);
        try {
            const response = await axios.post("http://ppemanagement.andrieinthesun.com/updateStatusItem.php", {
                id: id,
                stat: stat
            });
            if(response.data.success){
                console.log(response.data.message);
                setOpenOverlay(false);
            }
        } catch (error) {
            console.error("Error submitting for approval:", error);
            alert("Failed to submit for approval.");
        }
    }

    const handleViewReports = () => {
      navigate("/scanned-item");
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
                <ListItem button onClick={() => handleListItemClick("/inspection")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <ReportIcon style={{ color: "#0F1D9F"}}/>
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
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
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

            <div style={{ flexGrow: 1, padding: "80px 40px" }}>
                <header className="inventory-header">
                    <div className="header-content">
                        <div className="header-text"> 
                            <h1>Inspection Component</h1>
                            <p>Record of Property or Equipment Issued</p>
                        </div>
                        <button className="view-reports-button" onClick={handleViewReports}><FaEye /> View Reports</button>
                    </div>
                    <hr className="header-divider" />
                </header>

                <div className="inspection-container">
                  <div className="camera-screen">
                    <video ref={videoRef} autoPlay playsInline muted></video>
                  </div>

                  {checkOverlay && (
                      <div className="custom-overlay">
                          <div className="overlay-content">
                              <h2>Notice</h2>
                              <div className="center-button">
                                <p>{messages}</p>
                                <Button
                                  style={{ backgroundColor: "#0F1D9F", color: "white", marginTop: '20px' }}
                                  onClick={() => setCheckOverlay(false)}
                                >
                                  Close
                                </Button>
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="item-information">
                    {openOverlay ? (
                        <>
                            <h1>Item Information</h1>
                            <p>Description: {itemGet.description}</p>
                            <p className="property-number">Property/Inventory Number: {itemGet.item_id}</p>
                            <p>PAR/ICS No.: {itemGet.form_id}</p>
                            <p>Department/Custodian: {itemGet.department} {itemGet.fullname}</p>
                            {/* <p>Condition/Status: {itemInfo.conditionStatus}</p> */}

                            <div className="condition-buttons">
                                <button onClick={() => updateScanItem(itemGet.item_id, 'Serviceable')}>Serviceable</button>
                                <button onClick={() => updateScanItem(itemGet.item_id, 'Unserviceable')}>Unserviceable</button>
                            </div>
                        </>
                    ) : (
                        <div className="placeholder-message">
                            <div className="manual-search">
                                <h2>Scan QR Code <br /> or Enter Property/Inventory Number:</h2>
                                <input
                                    id="manual-input"
                                    type="text"
                                    placeholder="Enter Property/Inventory Number"
                                    value={inputValue} // Bind the input value to qrData
                                    onChange={(e) => setInputValue(e.target.value)} // Update qrData on input change
                                />
                                <button
                                    className="confirm-button"
                                    onClick={() => checkItemInfo(inputValue)}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Inspection;