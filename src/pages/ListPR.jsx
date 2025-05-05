import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Visibility, CheckCircle, Cancel } from "@mui/icons-material";
import "./ApprovePR.css"; // Add custom styles if needed

function ListPR() {
  const [search, setSearch] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState([
    {
      id: 1,
      requestNo: "PR2025-001",
      date: "05/03/2025",
      requestedBy: "Angelo, Aban P.",
      department: "Assessor's Office",
      totalCost: 20000,
      status: "Pending",
    },
    {
      id: 2,
      requestNo: "PR2025-001",
      date: "05/03/2025",
      requestedBy: "Marmol, Samantha L.",
      department: "Treasurer's Office",
      totalCost: 10000,
      status: "Approved",
    },
    {
      id: 3,
      requestNo: "PR2025-001",
      date: "05/03/2025",
      requestedBy: "Come, James B.",
      department: "Office of the Mayor",
      totalCost: 50000,
      status: "Rejected",
    },
  ]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredRequests = purchaseRequests.filter((pr) =>
    pr.requestNo.toLowerCase().includes(search.toLowerCase()) ||
    pr.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
    pr.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (id) => {
    alert(`Viewing details for Purchase Request ID: ${id}`);
  };

  const handleApprove = (id) => {
    alert(`Approved Purchase Request ID: ${id}`);
  };

  const handleDecline = (id) => {
    alert(`Declined Purchase Request ID: ${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0F1D9F" }}>Purchase Request</h1>
      <p style={{ color: "#666" }}>Record of Property or Equipment Issued</p>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ color: "#0F1D9F" }}>Purchase Request List</h2>
        <TextField
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          style={{ width: "300px" }}
        />
      </div>

      {/* Purchase Request Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Purchase Request No.</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Date</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Requested By</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Department</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Total Cost</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((pr) => (
              <TableRow key={pr.id}>
                <TableCell>{pr.requestNo}</TableCell>
                <TableCell>{pr.date}</TableCell>
                <TableCell>{pr.requestedBy}</TableCell>
                <TableCell>{pr.department}</TableCell>
                <TableCell>{pr.totalCost.toLocaleString()}</TableCell>
                <TableCell>{pr.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleView(pr.id)}
                  >
                    <Visibility />
                  </IconButton>
                  {pr.status === "Pending" && (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(pr.id)}
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDecline(pr.id)}
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ListPR;