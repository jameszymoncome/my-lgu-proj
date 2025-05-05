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
  Typography,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./ApprovePR.css"; // Add custom styles if needed

function ApprovePR() {
  const [items, setItems] = useState([
    { id: 1, quantity: 1, description: "Laptop", unitPrice: 30000, total: 30000 },
  ]);
  const [purpose, setPurpose] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApprove = () => {
    alert("Purchase Request Approved!");
  };

  const handleDecline = () => {
    alert("Purchase Request Declined!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0F1D9F" }}>Purchase Request</h1>
      <p style={{ color: "#666" }}>Record of Property or Equipment Issued</p>

      {/* Requester Info */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6" style={{ color: "#0F1D9F", marginBottom: "10px" }}>
          Requester Info
        </Typography>
        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
          <TextField
            label="Date"
            type="date"
            defaultValue="2025-05-03"
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
          />
          <TextField
            label="Request No."
            defaultValue="Draft-2025-001"
            fullWidth
            disabled
          />
          <TextField
            label="Requested By"
            defaultValue="Juan Dela Cruz"
            fullWidth
            disabled
          />
          <TextField
            label="Department"
            defaultValue="Planning and Development Office"
            fullWidth
            disabled
          />
        </div>
      </div>

      {/* Items Table */}
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item No.</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Article/Description</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.unitPrice.toLocaleString()}</TableCell>
                <TableCell>{item.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Expand/Collapse Button */}
      <Button
        variant="text"
        onClick={handleToggleExpand}
        style={{ color: "#0F1D9F", marginBottom: "20px" }}
        startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
      >
        {isExpanded ? "Hide All" : "Show All"}
      </Button>

      {/* Total Estimated Cost */}
      <Typography
        variant="h6"
        style={{ textAlign: "right", marginBottom: "20px", color: "#0F1D9F" }}
      >
        Total Estimated Cost:{" "}
        {items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
      </Typography>

      {/* Purpose Field */}
      <Typography variant="h6" style={{ color: "#0F1D9F", marginBottom: "10px" }}>
        Purpose
      </Typography>
      <TextField
        multiline
        rows={4}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        fullWidth
        disabled
        style={{ marginBottom: "20px" }}
      />

      {/* Remarks Field */}
      <Typography variant="h6" style={{ color: "#0F1D9F", marginBottom: "10px" }}>
        Remarks
      </Typography>
      <TextField
        multiline
        rows={4}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      />

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: "red",
            color: "white",
          }}
          onClick={handleDecline}
        >
          Decline
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "green",
            color: "white",
          }}
          onClick={handleApprove}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}

export default ApprovePR;