import React, { useState, useEffect } from "react";
import "./Homes_1.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCamera, faClipboard } from "@fortawesome/free-solid-svg-icons";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  TableChart as TableChartIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  QrCode as QrCodeIcon,
  List as ListIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Header from "../components/Header/Header.jsx"; // Import the Header component
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { set } from "date-fns";
import axios from "axios";

// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const drawerWidth = 240;

const Home_1 = () => {
  const navigate = useNavigate();
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setReportMenuOpen((prevOpen) => !prevOpen);
  };

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const [firstName, setFirstName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  
    useEffect(() => {
      const storedFirstName = localStorage.getItem("firstName");
      const storeduserRole = localStorage.getItem("userRole");
      const storedUserDepartment = localStorage.getItem("userDepartment");
      if (storedFirstName || storeduserRole) {
          setFirstName(storedFirstName);
          setUserRole(storeduserRole);
          setUserDepartment(storedUserDepartment);
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
          navigate("/home-1")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  const [allRequests, setAllRequests] = useState([]);
  


  const [NoOfFixedAssets, setNoOfFixedAssets] = useState();
  const [NoOfDepartments, setNoOfDepartments] = useState();
  const [PendingPurchaseRequests, setPendingPurchaseRequests] = useState();
  useEffect(() => {
    fetch("https://ppemanagement.andrieinthesun.com/home_details.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNoOfFixedAssets(data.total_fixed_assets);
          setNoOfDepartments(data.total_department);
          setPendingPurchaseRequests(data.pending_requests);
          // Use data.total_fixed_assets, data.total_department, data.pending_requests
        }
      });
    const fetchRequestData = async () => {
      try {
        const response = await axios.get("https://ppemanagement.andrieinthesun.com/getRequestData.php");
        console.log("Request Data:", response.data.data);
        setAllRequests(response.data.data);
      } catch (error) {
        console.error("Error fetching request data:", error);
        alert("Failed to fetch request data.");
      }
    };

    fetchRequestData();
}, []);

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "Do you really want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, Stay",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0F1D9F",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };



    // Data for the Doughnut chart
    const userData = {
        labels: ["DEPARTMENT HEAD", "CUSTODIAN"],
        datasets: [
            {
                data: userRole === "ADMIN" ? [300, 50] : userRole === "DEPARTMENT HEAD" ? [150, 50] : [50, 10],
                backgroundColor: ["#36A2EB", "#FF6384"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true, // Enable the legend
                position: "bottom", // Position the legend below the chart
                labels: {
                    boxWidth: 15, // Size of the legend color box
                    padding: 10, // Spacing between legend items
                    font: {
                        size: 12, // Font size for legend text
                    },
                },
            },
        },
    };

    // Define stats and user card content based on user role
    const stats =
        userRole === "ADMIN"
            ? [
                  { title: "No. of Fixed Assets", value: NoOfFixedAssets },
                  { title: "Departments/Offices", value: NoOfDepartments },
                  { title: "Fixed Assets for Maintenance/Repair", value: "47" },
                  { title: "Pending Purchase Requests", value: PendingPurchaseRequests },
                  { title: "Inspection Month", value: "JUNE 2025" },
                  { title: "Last Inspection Date", value: "May 2025" },
              ]
            : userRole === "DEPARTMENT HEAD"
            ? [
                  { title: "No. of Fixed Assets", value: "300" },
                  { title: "Fixed Assets for Maintenance/Repair", value: "10" },
                  { title: "Inspection Month", value: "JUNE 2025" },
                  { title: "Pending Purchase Requests", value: "5" },
                  { title: "Last Inspection Date", value: "May 2025" },
              ]
            : userRole === "CUSTODIAN"
            ? [
                  { title: "Assets Assigned to Me", value: "50" },
                  { title: "Assets Marked for Repair", value: "5" },
                  { title: "Inspection Month", value: "JUNE 2025" },
              ]
            : [];

    const userCardTitle =
        userRole === "ADMIN"
            ? "USER"
            : userRole === "DEPARTMENT HEAD"
            ? "USER"
            : userRole === "CUSTODIAN"
            ? "USER"
            : "USER";

    // Filter data based on user role
    const filteredRequests =
        userRole === "ADMIN"
            ? allRequests // Admin sees all requests
            : userRole === "DEPARTMENT HEAD"
            ? allRequests.filter((request) => request.department === userDepartment) // Example: Department Head sees only their department's requests
            : userRole === "CUSTODIAN"
            ? allRequests.filter((request) => request.department === userDepartment && request.status === "Pending") // Example: Custodian sees only their pending requests
            : [];

  return (
    <div className="home-container">
      {/* Header */}
      <Header />

      {/* Sidebar Drawer */}
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
          <ListItem button onClick={() => handleListItemClick("/home-1")} style={{ color: "#0F1D9F"}}>
            <ListItemIcon>
              <HomeIcon style={{ color: "#0F1D9F"}}/>
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
          <ListItem button onClick={() => handleListItemClick("/department")} >
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

      <div className="main-contentss">
            <header className="home-header">
                <div className="header-content">
                    <h1>
                        {userRole === "ADMIN"
                            ? "Welcome Admin, to the Inventory Management System"
                            : userRole === "DEPARTMENT HEAD"
                            ? "Welcome Department Head, to the Inventory Management System"
                            : userRole === "CUSTODIAN"
                            ? "Welcome Custodian, to the Inventory Management System"
                            : "Welcome to the Inventory Management System"}
                    </h1>
                </div>
                <hr className="header-divider" />
            </header>

            {/* Dashboard Layout */}
            <div className="dashboard-layout">
                {/* User Card */}
                <div className="stat-card user-card">
                    <h3 className="user-title">{firstName}</h3>
                    <div className="donut-chart-container">
                        <Doughnut data={userData} options={options} />
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="stat-group">
                    {stats.map((stat, index) => (
                        <div className="stat-card" key={index}>
                            <div className="stat-row">
                                <h3>{stat.title}</h3>
                                <span className="stat-value">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="quick-links-and-table">
                {/* Quick Links Section */}
                <div className="quick-links">
                    {userRole === "admin" && (
                        <>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faClipboard} />
                                </div>
                                <span>Request</span>
                            </button>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faCamera} />
                                </div>
                                <span>Scan</span>
                            </button>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span>Reports</span>
                            </button>
                        </>
                    )}

                    {userRole === "dept head" && (
                        <>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faClipboard} />
                                </div>
                                <span>Request</span>
                            </button>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faCamera} />
                                </div>
                                <span>Scan</span>
                            </button>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span>Reports</span>
                            </button>
                        </>
                    )}

                    {userRole === "custodian" && (
                        <>
                            <button className="quick-link">
                                <div className="icon">
                                    <FontAwesomeIcon icon={faClipboard} />
                                </div>
                                <span>Request</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Recently Added Purchase Requests Table */}
                <div className="recent-requests">
                    <h3>Recently Added Requests</h3>
                    <table className="recent-requests-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Department</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.date}</td>
                                    <td>{request.department}</td>
                                    <td>{request.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Home_1;