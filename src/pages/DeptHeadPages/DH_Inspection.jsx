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
import '../inspection.css';
import '../../index.css';
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";

const drawerWidth = 240;

const DH_Inspection = () => {
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

    const handleViewRecord = () => {
        navigate("/inspec-scanner")
    }

    const checkItemInfo = async (valueFromScan) => {
        const value = valueFromScan || inputValue;

        if(value === ''){
            alert('Enter id');
            return;
        }
        try {
            const response = await axios.post("http://ppemanagement.andrieinthesun.com/scanItem.php", {
                value: value,
            });
    
            if (response.data.success) {
                setItemGet(response.data.data[0]);
                console.log(response.data.data[0]);
                setNewCheck(true);
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
                <ListItem button onClick={() => handleListItemClick("/dh-inspection")} style={{ color: "#0F1D9F"}}>
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
                      onClick={() => handleListItemClick("/dh-parics1")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/dh-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
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

            <div style={{ flexGrow: 1, padding: "80px 40px" }}>
                <header className="inventory-header">
                    <div className="header-content">
                        <div className="header-text"> 
                            <h1>Inspection Component</h1>
                            <p>Record of Property or Equipment Issued</p>
                        </div>
                        <button className="view-reports-button"><FaEye /> View Reports</button>
                    </div>
                    <hr className="header-divider" />
                </header>

                <div className="inspection-container">
                    <div className="camera-screen">
                        <video ref={videoRef} autoPlay playsInline muted></video>
                    </div>

                    <div className="item-information">
                        <h1>Item Information</h1>
                        <Box>
                            <TextField
                                size="small"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Button className="open-overlay-btn" onClick={() => checkItemInfo()}>Show Overlay</Button>
                        </Box>
                    </div>

                    {checkOverlay && (
                        <div className="custom-overlay">
                            <div className="overlay-content">
                                <h2>Notice</h2>
                                <p>{messages}</p>
                                <Button style={{ backgroundColor: "#0F1D9F", color: "white", marginTop: '20px'}} onClick={() => setCheckOverlay(false)}>Close</Button>
                            </div>
                        </div>
                    )}

                    {openOverlay && (
                        <div className="custom-overlay">
                            <div className="overlay-content">
                                <h2>Item Information</h2>
                                <p>Property/Inventory Number: {itemGet.item_id}</p>
                                <p>PAR/ICS No. : {itemGet.form_id}</p>
                                <p>Department: {itemGet.department}</p>
                                <p>Custodian : {itemGet.fullname}</p>
                                {newCheck && (
                                    <div>
                                        <p>Previous Check Inspection</p>
                                        <p>Date: {itemGet.dates}</p>
                                        <p>Status: {itemGet.status}</p>
                                    </div>
                                )}
                                <p>Condition/Status :</p>
                                <div style={{ display: 'flex', gap: '10px'}}>
                                    <Button 
                                        style={{ 
                                            backgroundColor: "#0F1D9F",
                                            color: "white",
                                            flex: 1  }}
                                            onClick={() => updateScanItem(itemGet.item_id, 'Serviceable')}
                                        >
                                            Serviceable
                                    </Button>
                                    <Button 
                                        style={{ 
                                            backgroundColor: "#0F1D9F",
                                            color: "white",
                                            flex: 1  }}
                                            onClick={() => updateScanItem(itemGet.item_id, 'Unserviceable')}
                                        >
                                            Unserviceable
                                    </Button>
                                </div>
                                <Button style={{ backgroundColor: "#0F1D9F", color: "white", marginTop: '20px'}} onClick={() => setOpenOverlay(false)}>Close</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DH_Inspection;