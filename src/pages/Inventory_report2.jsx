import React, { useState } from "react"; 
import "./Inventory_report2.css"; 
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import Header from "../components/Header/Header.jsx"; 
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";

const drawerWidth = 240;

function Inventory_report2() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedOption, setSelectedOption] = useState(""); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "16px",
    color: "#0f1d9f", 
    borderBottom: `2px solid #979797`,
    textAlign: "center",
    border : "1px solid #979797",
  }));
  
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: "10px",
    marginLeft: "35px", 
    marginRight: "20px",
    width: "100%",
    maxWidth: "1140px",
    borderRadius: "10px",
    border: "1px solid #979797",
    overflowY: "auto",
  }));
  
  const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "normal", 
    fontSize: "12px",
    textAlign: "center",
    border:"2px solid #979797"
  }));

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
          },
        }}
      >
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="PPE Entry Form" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Inspection" />
          </ListItem>
          <ListItem button style={{ background: "#E4E7F5", color: "#0F1D9F" }}>
            <ListItemIcon>
              <ReportIcon style={{ color: "#0F1D9F" }} />
            </ListItemIcon>
            <ListItemText primary="Records" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Tables" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
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
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", // Enables vertical scrolling
          overflowX: "hidden", // Prevents horizontal scrolling
          height: "100vh",
          width: "100%", 
          maxWidth: "1200px",
          margin: "0 auto", 
          padding: "10px", 
        }}
      >

      <div style={{ flexGrow: 1, padding: "10px" }}>
        <div className="header-container">
          <h1>Inventory Reports</h1>
          <p className="text">Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
        </div>

        <div className="search-dropdown-container" >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            InputProps={{
              startAdornment: (
                <SearchIcon className="search-icon" />
              ),
            }}
          />

          <FormControl variant="outlined" className="dropdown" >
            <InputLabel>Filter</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleDropdownChange}
              label="Filter"
            >
              <MenuItem value="">All</MenuItem>
            </Select>
          </FormControl>
        
        </div>
        <StyledTableContainer component={Paper}>
    <Table size="medium">
      <TableHead>
        <TableRow>
          <StyledTableCell>Quantity</StyledTableCell>
          <StyledTableCell>Unit</StyledTableCell>
          <StyledTableCell>Description</StyledTableCell>
          <StyledTableCell>Property No.</StyledTableCell>
          <StyledTableCell>Date Acquired</StyledTableCell>
          <StyledTableCell>Unit Cost</StyledTableCell>
          <StyledTableCell>Total Cost</StyledTableCell>
          <StyledTableCell>Action</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
          <StyledTableDataCell>-</StyledTableDataCell>
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
              onClick={() => alert("View button clicked!")}
            >
              View
            </button>
          </StyledTableDataCell>
        </TableRow>
      </TableBody>
    </Table>
  </StyledTableContainer>

        
        
      </div> 
    </div>  
</div>  

  );
}

export default Inventory_report2;