import React, { useState, useEffect } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, Typography, TextField } from "@mui/material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Checkbox
} from "@mui/material";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  TableChart as TableChartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Header from "../../components/Header/Header.jsx";
import { useNavigate, useParams } from "react-router-dom";
import "../Purchase_list.css";
import { format } from 'date-fns';
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";


const drawerWidth = 240;

function CTN_PurchaseListView() {
    const { requestId  } = useParams(); // Destructuring to get the req_id

  const [items, setItems] = useState([]);

  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState(null);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [getRequestedItem, setGetRequestedItem] = useState([]);
  const [formData, setFormData] = useState({
    req_id: '',
    date: null,
    requestedBy: '',
    department: '',
    quantities: '',
    descriptions: '',
    unit_prices: '',
    total_amount: '',
    });
  const navigate = useNavigate();

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
          navigate("/ctn-purchase-list-view/:requestId")
        }

        else if (storeduserRole === "ADMIN") {
          navigate("/home-1")
        }

        else {
          navigate("/")
        }
  }, [navigate]);

  useEffect(() => {
    const getDataRequest = async () => {
        try {
          const response = await axios.post("http://ppemanagement.andrieinthesun.com/getDataRequest.php", {
            requestId: requestId,
          });
          const result = response.data.data[0];
          console.log(result);

          const formattedDate = result?.date ? new Date(result.date) : null;

          const quantities = result.quantities?.split(',').map(q => q.trim());
          const descriptions = result.descriptions?.split(',').map(d => d.trim());
          const unitPrices = result.unit_prices?.split(',').map(p => parseFloat(p.trim()));

          const itemsArray = quantities.map((qty, index) => {
            const quantity = parseInt(qty, 10);
            const unitPrice = unitPrices[index] || 0;
            return {
              id: index + 1,
              quantity,
              originalQuantity: qty,
              description: descriptions[index] || '',
              serialNo: '',
              unitPrice,
              total: quantity * unitPrice,
              date: null, 
              checked: false,
            };
          });

          setItems(itemsArray);

          setFormData({
              req_id: result.req_id,
              date: formattedDate,
              requestedBy: result.requestedBy,
              requested_id: result.requested_id,
              department: result.department,
              quantities: result.quantities,
              descriptions: result.descriptions,
              unit_prices: result.unit_prices,
              total_amount: result.total_amount,
              process_id: result.process_id,
          });
        } catch (error) {
            console.error("Error fetching purchase data:", error);
            alert("Failed to fetch purchase data.");
        }
    }
    getDataRequest();
  }, []);

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      quantity: 1,
      description: "",
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "description" ? value : Number(value);
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    setItems(updatedItems);
  };

  const handleListItemClick = (route) => {
    navigate(route);
  };

  const toggleReportMenu = () => {
    setIsReportMenuOpen(!isReportMenuOpen);
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

  const handleItemCheckChange = (index, checked) => {
    const updatedItems = [...items];
    updatedItems[index].checked = checked;
    setItems(updatedItems);
  };

  const handleDateChange = (index, newDate) => {
    const updatedItems = [...items];
    // Format the date to 'yyyy-MM-dd'
    updatedItems[index].date = newDate ? format(newDate, 'yyyy-MM-dd') : null;
    setItems(updatedItems);
  };
  const handleSerialChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].serialNo = value;
    setItems(updatedItems);
  };

  const handleSaveButton = async () => {
    console.log(items);
    try {
      const response = await axios.post("http://ppemanagement.andrieinthesun.com/checkingItem.php", {
        formData: formData,
        items: items,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Request submitted successfully!",
          text: response.data.message,
          confirmButtonText: "OK",
        });
      } else {
        alert("Failed to submit the request: " + response.data.message);
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
                <ListItem button onClick={() => handleListItemClick("/ctn-purchase-list")} style={{ color: "#0F1D9F"}}>
                  <ListItemIcon>
                    <AssignmentIcon style={{ color: "#0F1D9F"}}/>
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
                                      <AssignmentIcon/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/ctn-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon/>
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

      {/* Main Content */}
      <div style={{ padding: "20px", flexGrow: 1, marginTop: "40px" }}>
        <h1 style={{ color: "#0F1D9F" }}>Purchase Request</h1>
        <p style={{ color: "#0F1D9F" }}>Record of Property or Equipment Issued</p>
        <hr style={{ border: "1px solid rgba(39, 50, 64, 0.3)" }} />

        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <Box>
            <Typography variant="body1">Purchase Request Date:</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                slotProps={{
                textField: {
                    size: 'small',
                    fullWidth: true,
                },
                }}
                disabled
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <Typography variant="body1">Request No.:</Typography>
            <TextField
              size="small"
              value={formData.req_id}
              onChange={(e) => setFormData({ ...formData, req_id: e.target.value })}
              disabled
            />
          </Box>
          <Box>
            <Typography variant="body1">Requested By:</Typography>
            <TextField
              size="small"
              value={formData.requestedBy}
              onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
              disabled
            />
          </Box>
          <Box>
            <Typography variant="body1">Department:</Typography>
            <TextField
              size="small"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Item No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Article/Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Serial No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Unit Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Acquisition Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                      size="small"
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.description}
                      onChange={(e) => handleInputChange(index, "description", e.target.value)}
                      size="small"
                      disabled
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={item.serialNo}
                      onChange={(e) => handleSerialChange(index, e.target.value)}
                      disabled
                    />
                  </TableCell>

                  <TableCell>
                    <TextField  
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleInputChange(index, "unitPrice", e.target.value)}
                      size="small"
                      disabled
                    />
                  </TableCell>
                  <TableCell>{item.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDateFns} disabled>
                      <DatePicker
                        value={item.date ? new Date(item.date) : null}
                        onChange={(newDate) => handleDateChange(index, newDate)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                        format="yyyy-MM-dd"
                        disabled
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      checked={item.checked}
                      onChange={(e) => handleItemCheckChange(index, e.target.checked)}
                      disabled
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" alignItems="center" marginBottom={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Amount: {items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-end"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
          }}
        >
          {/* <Button variant="outlined" color="primary" sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveButton}>
            Save
          </Button> */}
        </Box>
      </div>
    </div>
  );
}

export default CTN_PurchaseListView;
