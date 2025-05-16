import React, { useState, useEffect } from 'react';
import './Disposal.css';
import { FaPrint } from 'react-icons/fa';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Button,
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx"; // Import the Header component
import axios from "axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const drawerWidth = 240;

const Disposal = () => {
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

  const [itemsForDisposal, setItemsForDisposal] = useState([]);


  useEffect(() => {
    const fetchDisposalItems = async () => {
      try{
        const response = await axios.post("http://localhost/myServer/getDisposalItem.php");
        console.log(response.data.data);
        setItemsForDisposal(response.data.data);
      } catch (error) {
        console.error("Error fetching disposal items:", error);
      }
    }


    fetchDisposalItems();
  }, []);


  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    const content = `
      <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 20px;">

        <div style="text-align: center; font-size: 20px; font-weight: bold;">
          DISPOSAL REPORT
        </div>

        <table border="1" cellspacing="0" cellpadding="10" style="width:100%; margin-top: 30px; border-collapse: collapse; font-size: 10px; text-align: center;">
          <thead>
            <tr>
              <th>Property/Inventory No.</th>
              <th>Item Description</th>
              <th>Acquisition Date</th>
              <th>Acquisition Cost</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${itemsForDisposal.map(row => `
              <tr>
                <td>${row.item_id}</td>
                <td>${row.description}</td>
                <td>${row.date_acquisition}</td>
                <td>${row.unit_price}</td>
                <td>${row.department}</td>
                <td>${row.status}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = content;
    document.body.appendChild(element); // Needed for html2pdf to work

    const opt = {
      margin:       [20, 20, 40, 20], // top, left, bottom, right
      filename:     'generated.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const footerText = `Generated on: ${new Date().toLocaleString()}`;
      pdf.setFontSize(10);
      pdf.setTextColor(100);

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const textWidth = pdf.getTextWidth(footerText);
        const x = pageWidth - textWidth - 40;
        const y = pageHeight - 20;
        pdf.text(footerText, x, y);
      }
    }).save().then(() => {
      document.body.removeChild(element); // Clean up after rendering
    });
  };


  return (
    <div style={{ display: "flex" }}>
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
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleListItemClick("/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick("/ppe-entry")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="PPE Entry Form" />
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

      {/* Main Content */}
      <div className="main-content" >
            <header className="inventory-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>List of Items for Disposal</h1>
                        <p>Record of Property or Equipment for Disposal</p>
                    </div>
                    <div className="button-container">
                      <button
                        className="view-reports-button"
                        onClick={() => handleExportPDF()}
                      >
                        <FaPrint /> Print Reports
                      </button>
                    </div>
                      
                </div>
                <hr className="header-divider" />
            </header>

            <div className="disposal-item-container">
                    <div className="search-filter-container">
                        <input
                            type="text"
                            placeholder="Search by Property No. or Article"
                            className="search-bar"
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                setItemsForDisposal((prevItems) =>
                                    prevItems.map((item) => ({
                                        ...item,
                                        isVisible:
                                            item.item_id.toLowerCase().includes(searchTerm) ||
                                            item.description.toLowerCase().includes(searchTerm),
                                    }))
                                );
                            }}
                        />
                        <select
                            className="filter-dropdown-department"
                            onChange={(e) => {
                                const selectedDepartment = e.target.value;
                                setItemsForDisposal((prevItems) =>
                                    prevItems.map((item) => ({
                                        ...item,
                                        isVisible:
                                            selectedDepartment === '' || item.department === selectedDepartment,
                                    }))
                                );
                            }}
                        >
                            <option value="">All Departments</option>
                            {[...new Set(itemsForDisposal.map((item) => item.department))].map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>
                <table className="disposal-table">
                    <thead>
                        <tr>
                            <th>Property/Inventory No.</th>
                            <th>Item Description</th>
                            <th>Acquisition Date</th>
                            <th>Acquisition Cost</th>
                            <th>Department</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsForDisposal
                            .filter((item) => item.isVisible !== false) // Only show items where isVisible is true or undefined
                            .map((item) => (
                                <tr>
                                    <td>{item.item_id}</td>
                                    <td>{item.description}</td>
                                    <td>{item.date_acquisition}</td>
                                    <td>{item.unit_price}</td>
                                    <td>{item.department}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Disposal;
