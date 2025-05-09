import React, { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./Home_1.css";
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
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx";

const drawerWidth = 240;

// Register required chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Home_1 = () => {
  const navigate = useNavigate();
  const [isReportMenuOpen, setReportMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setReportMenuOpen((prevOpen) => !prevOpen);
  };

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0F1D9F",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const userData = React.useMemo(() => ({
    labels: ["Admins", "Users", "Guests"],
    datasets: [
      {
        label: "User Roles",
        data: [10, 50, 5],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 1,
      },
    ],
  }), []);

  const options = React.useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "User Distribution",
      },
    },
  }), []);

  const statsData = [
    { label: "No. of Fixed Assets", value: "1,000" },
    { label: "Fixed Assets for Maintenance/Repair", value: "47" },
    { label: "Departments/Offices", value: "45" },
    { label: "Inspection Month", value: "JUNE 2025", large: true },
  ];

  const activities = [
    { date: '2025-06-20', description: 'Added new item', status: 'Completed' },
    { date: '2025-06-19', description: 'Scanned package', status: 'Pending' },
    { date: '2025-06-18', description: 'Requested delivery', status: 'In Progress' },
  ];

  return (
    <div className="home-container">
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
          <ListItem button onClick={() => handleListItemClick("/home")} style={{ color: "#0F1D9F"}}>
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
          <ListItem button onClick={() => handleListItemClick("/inven-inspect")}>
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
                <ListItemText primary="PAR & ICS" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: 32 }}
                onClick={() => handleListItemClick("/inventory")}
              >
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
          <ListItem button onClick={() => handleListItemClick("/manage-tables")}>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Tables" />
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
      <div className="main-content" style={{marginTop: "4rem"}}>
        <header className="home-header">
          <div className="header-content">
            <h1>Welcome to the Inventory Management System</h1>
          </div>
          <hr className="header-divider" />
        </header>
        <div className="dashboard-layout">
          <div className="stat-card user-card">
            <h3>USER</h3>
            <div className="donut-chart">
              <Doughnut data={userData} options={options} />
            </div>
          </div>
          <div className="stat-group">
            {statsData.map((stat, index) => (
              <div className="stat-card" key={index}>
                <h3>{stat.label}</h3>
                <span className={`stat-value ${stat.large ? "large" : ""}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div className="button-stack">
              <button>Add Item</button>
              <button>Scan</button>
              <button>Request</button>
            </div>
            <div>
              <h2>Recent Activity</h2>
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.date}</td>
                      <td>{activity.description}</td>
                      <td>{activity.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_1;